import dbConnection from "../db/dbConnection.mjs";
import ShoppingCart from "../models/ShoppingCart.mjs";

// Function to get all shopping carts from the database
export async function getAllShoppingCarts() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ShoppingCart', [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Map the fields from the result of the database to the fields of the ShoppingCart constructor
                const shoppingCarts = await Promise.all(rows.map(async (row) => {
                    // Fetching reservations associated with this shopping cart, if any
                    let reservations = [];
                    if (row.ReservationID) {
                        try {
                            const reservation = await getReservationById(row.ReservationID);
                            reservations.push(reservation);
                        } catch (e) {
                            console.error("Error fetching reservation: ", e);
                        }
                    }

                    // Fetch allergies and special requests from the shopping cart
                    let allergies = row.Allergies ? row.Allergies.split(',') : [];
                    let requests = row.Requests ? row.Requests.split(',') : [];

                    // Create a ShoppingCart object for each row in the result
                    const shoppingCart = new ShoppingCart(
                        row.ShoppingCartID,  // ShoppingCartID to id
                        row.UserID,           // UserID to userId
                        reservations,         // Reservations associated with this cart
                        allergies,            // Allergies list
                        requests              // Special requests list
                    );

                    return shoppingCart;
                }));

                resolve(shoppingCarts);  // Resolve the promise with all the shopping carts
            }
        });
    });
}

// Function to get a reservation by its ID
async function getShoppingCartByID(shoppingCartID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM ShoppingCart WHERE ShoppingCartID = ?', [shoppingCartID], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// 3.a, function to create and store a new bag
//TODO: remeber to manage RESERVATIONS
export async function createShoppingCart(userID,reservations,allergies,requests) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO ShoppingCart (UserID,ReservationID,Allergies,Requests) VALUES (?, ?, ?, ?)',
            [userID,reservationID,allergies,requests],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating ShoppingCart:', err.message);
                } else {
                    console.log(`ShoppingCart created successfully with ID: ${this.lastID}`);
                    const newBag = new Bag(this.lastID,userID,reservations,allergies,requests,dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    resolve(newBag);
                }
            }
        );
    });
}


// 3.a, function to delete a ShoppingCart by ID
export async function deleteShoppingCartById(bagID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM ShoppingCart WHERE ShoppingCartID = ?',
            [bagID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting ShoppingCart:', err.message);
                } else {
                    if (this.changes > 0) { 
                        resolve({ success: true, message: `ShoppingCart with ID ${shoppingCartID} deleted successfully` });
                    } else {
                        console.log(`No ShoppingCarts found with ID ${shoppingCartID}`);
                        resolve({ success: false, message: `No ShoppingCart found with ID ${shoppingCartID}` });
                    }
                }
            }
        );
    });
}


// 3.c, function to update a specific item
export async function updateShoppingCart(shoppingCartID, updates) {
    const db = await dbConnection.openConnection();
    
    const updateFields = [];
    const values = [];
    
    if (updates.userID !== undefined) {
        updateFields.push('UserID = ?');
        values.push(updates.userID);
    }
    
    if (updates.requests !== undefined) {
        updateFields.push('Requests = ?');
        values.push(updates.requests);
    }

    if (updates.allergies !== undefined) {
        updateFields.push('Allergies = ?');
        values.push(updates.allergies);
    }

    if (updates.reservations !== undefined) {
        updateFields.push('Reservations = ?');
        values.push(updates.reservations);
    }
    
    if (updateFields.length === 0) {
        return Promise.resolve({ 
            success: false, 
            message: 'No updates provided' 
        });
    }
    
    values.push(foodItemId);
    
    const sql = `UPDATE ShoppingCart SET ${updateFields.join(', ')} WHERE ShoppingCartID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating ShoppingCart:', err.message);
            } else {
                if (this.changes > 0) {
                    resolve({ 
                        success: true, 
                        message: `ShoppingCart with ID ${bagID} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No ShoppingCart found with ID ${bagID} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No ShoppingCart with ID ${bagID} or no changes made` 
                    });
                }
            }
        });
    });
}


export default {getAllShoppingCarts,
                deleteShoppingCartById,
                updateShoppingCart,
                createShoppingCart,
                getShoppingCartByID
};
