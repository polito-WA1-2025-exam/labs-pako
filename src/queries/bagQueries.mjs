import dbConnection from "../db/dbConnection.mjs";
import Bag from "../models/Bag.mjs";

// Function to get all removed items for a specific BagID
async function getAllRemovedItems(BagID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM RemovedItems WHERE BagID = ?', [BagID], (err, rows) => {
            if (err) {
                reject(err);
            } else {        
                resolve(rows);
            }
        });
    });
}
// Function to get all removed items for a specific BagID
async function gettAllBagFoodItems(BagID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM BagFoodItem WHERE BagID = ?', [BagID], (err, rows) => {
            if (err) {
                reject(err);
            } else {        
                //const foodItems = rows.map(row => new FoodItem(row.FoodItemID, row.Name, row.Quantity, row.CreationDate));
                resolve(rows);
            }
        });
    });
}

// Function to get all bags from the database and associate user and establishment
export async function getAllBags() {
    const db = await dbConnection.openConnection();
    return new Promise(async (resolve, reject) => { // Add async here
        // Query to join Bag with User and Establishment
        db.all(
            `SELECT 
                b.BagID, 
                b.Type,
                b.Size,
                b.Price, 
                b.EstablishmentID, 
                b.TimeToPickUp, 
                b.State, 
                b.RemovedItems,  
                b.UserID, 
                b.CreationDate
            FROM Bag b`, 
            [], 
            async (err, rows) => { // Use async here as well
                if (err) {
                    reject(err);
                } else {
                    const bags = await Promise.all(rows.map(async (row) => { // Use await for the mapping
                        let removedItems = [];
                        try {
                            removedItems = await getAllRemovedItems(row.BagID); // Now using await properly
                        } catch (e) {
                            console.error("Error fetching RemovedItems: ", e);
                        }

                        let content = [];
                        try {
                            content = await gettAllBagFoodItems(row.BagID); // Now using await properly
                        } catch (e) {
                            console.error("Error fetching BagFoodItems: ", e);
                        }

                        // Create a Bag object
                        const bag = new Bag(
                            row.BagID,
                            row.Type,        
                            row.Size, 
                            content, // TODO: add array of fooditems
                            row.Price,
                            row.EstablishmentID,
                            row.TimeToPickUp,
                            row.State,
                            row.UserID,
                            removedItems,  // Pass removedItems to the bag object
                            row.CreationDate
                        );

                        return bag; // Return the bag with the user and establishment associated
                    }));

                    resolve(bags); // Resolve with the bags array
                }
            }
        );
    });
}

// For 2.b, function to get bags by condition of date range
export async function getBagsByDateRange(startDate, endDate) {
    const db = await dbConnection.openConnection();
    return new Promise(async (resolve, reject) => {
        db.all(
            `SELECT 
                b.BagID, 
                b.Type,
                b.Size,
                b.Price, 
                b.EstablishmentID, 
                b.TimeToPickUp, 
                b.State, 
                b.RemovedItems,  
                b.UserID, 
                b.CreationDate
            FROM Bag b
            WHERE b.TimeToPickUp BETWEEN ? AND ?`, //
            [startDate, endDate], 
            async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const bags = await Promise.all(rows.map(async (row) => {
                        let removedItems = [];
                        try {
                            removedItems = await getAllRemovedItems(row.BagID);
                        } catch (e) {
                            console.error("Error fetching RemovedItems: ", e);
                        }

                        let content = [];
                        try {
                            content = await gettAllBagFoodItems(row.BagID);
                        } catch (e) {
                            console.error("Error fetching BagFoodItems: ", e);
                        }

                        // Create a Bag object
                        const bag = new Bag(
                            row.BagID,
                            row.Type,        
                            row.Size, 
                            content,
                            row.Price,
                            row.EstablishmentID,
                            row.TimeToPickUp,
                            row.State,
                            row.UserID,
                            removedItems,
                            row.CreationDate
                        );

                        return bag;
                    }));

                    resolve(bags);
                }
            }
        );
    });
}


// 3.a, function to create and store a new bag
//TODO: remeber to put/check UserID null on creation
export async function createBag(type,size,price,establishmentID,state) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO Bag (Type,Size,Price,EstablishmentID,State) VALUES (?, ?, ?, ?, ?)',
            [type,size,price,establishmentID,state],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating food item:', err.message);
                } else {
                    console.log(`Food item created successfully with ID: ${this.lastID}`);
                    const newBag = new Bag(this.lastID,type,size,price,establishmentID,state,null,dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    resolve(newBag);
                }
            }
        );
    });
}


// 3.a, function to delete a Bag by ID
export async function deleteBagById(bagID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM Bag WHERE BagID = ?',
            [bagID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting food item:', err.message);
                } else {
                    if (this.changes > 0) { 
                        resolve({ success: true, message: `Bag with ID ${bagID} deleted successfully` });
                    } else {
                        console.log(`No food item found with ID ${foodItemId}`);
                        resolve({ success: false, message: `No food item found with ID ${bagID}` });
                    }
                }
            }
        );
    });
}


// 3.c, function to update a specific item
export async function updateBag(bagID, updates) {
    const db = await dbConnection.openConnection();
    
    const updateFields = [];
    const values = [];
    
    if (updates.type !== undefined) {
        updateFields.push('Type = ?');
        values.push(updates.type);
    }
    
    if (updates.size !== undefined) {
        updateFields.push('Size = ?');
        values.push(updates.size);
    }

    if (updates.price !== undefined) {
        updateFields.push('Price = ?');
        values.push(updates.price);
    }

    if (updates.establishmentID !== undefined) {
        updateFields.push('EstablishmentID = ?');
        values.push(updates.establishmentID);
    }

    if (updates.state !== undefined) {
        updateFields.push('State = ?');
        values.push(updates.state);
    }
    
    if (updateFields.length === 0) {
        return Promise.resolve({ 
            success: false, 
            message: 'No updates provided' 
        });
    }
    
    values.push(foodItemId);
    
    const sql = `UPDATE bag SET ${updateFields.join(', ')} WHERE BagID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating food item:', err.message);
            } else {
                if (this.changes > 0) {
                    resolve({ 
                        success: true, 
                        message: `Bag with ID ${bagID} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No food item found with ID ${bagID} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No food item found with ID ${bagID} or no changes made` 
                    });
                }
            }
        });
    });
}


export default { getAllBags,
                 getBagsByDateRange,
                 createBag,
                 updateBag,
                 deleteBagById
                };
