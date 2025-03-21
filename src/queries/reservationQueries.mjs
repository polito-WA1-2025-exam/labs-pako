import dbConnection from "../db/dbConnection.mjs";
import Reservation from "../models/Reservation.mjs";
import User from "../models/User.mjs";
import Bag from "../models/Bag.mjs";

// Get all reservations from the database, including associated User and Bags
export async function getAllReservations() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        // Query to join Reservation with User and Bag
        db.all(`
            SELECT 
                r.ReservationID, 
                r.TimeStamp, 
                r.Status, 
                r.UserID, 
                r.CreationDate, 
                b.BagID, 
                b.Price, 
                b.EstablishmentID, 
                b.TimeToPickUp, 
                b.State, 
                u.UserID as UserID, 
                u.Username as UserName,  
                u.Email as UserEmail
            FROM Reservation r
            LEFT JOIN Bag b ON r.BagID = b.BagID
            LEFT JOIN User u ON r.UserID = u.UserID;
        `, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Create a map of reservations by ID
                const reservationsMap = new Map();

                rows.forEach(row => {
                    // Create or get the existing reservation
                    let reservation = reservationsMap.get(row.ReservationID);
                    if (!reservation) {
                        reservation = new Reservation(
                            row.ReservationID,
                            row.TimeStamp,
                            row.Status,
                            [], 
                            row.UserID,
                            row.CreationDate
                        );
                        reservationsMap.set(row.ReservationID, reservation);
                    }

                    if (row.BagID) {
                        const bag = new Bag(
                            row.BagID,
                            row.Type,
                            row.Size,
                            row.Content ? JSON.parse(row.Content) : [], // Assuming content is stored as JSON string
                            row.Price,
                            row.EstablishmentID,
                            row.TimeToPickUp,
                            row.State
                        );

                        console.log(`Adding Bag: ${bag.id} to Reservation: ${reservation.id}`);
                        reservation.addBag(bag); // Add the bag to the reservation

                    } else {
                        console.log(`No Bag found for ReservationID: ${row.ReservationID}`);
                    }

                    // Associate user with the reservation, if not already done
                    if (row.UserID && !reservation.user) {
                        reservation.user = new User(row.UserID, row.UserName, row.UserEmail);
                    }
                });
                resolve(Array.from(reservationsMap.values()));
            }
        });
    });
}


 
// 2.b, function for searching for Establishments matching with name substring
export async function searchReservationByTimestamp(nameSubstring) {
    const db = await dbConnection.openConnection();
    //TODO: check how to get Bags
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Reservation WHERE Timestamp LIKE ?', [`%${nameSubstring}%`], (err, rows) => { 
            if (err) {
                reject(err);
            } else {
                const Reservation = rows.map(row => new Reservation(
                    row.ReservationID,
                    row.TimeStamp,
                    row.Status,
                    row.Bags, 
                    row.UserID,
                    row.CreationDate   
                ))
                resolve(establishments);
            }
        });
    });
}



// 3.a, function to create and store a new food item
export async function createReservation(timestamp,status,userID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO Reservation (Timestamp,Status,UserID) VALUES (?, ?, ?, ?, ?, ?)',
            [timestamp,status,userID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating food item:', err.message);
                } else {
                    console.log(`Reservation created successfully with ID: ${this.lastID}`);
                    const newReservation = new FoodItem(this.lastID,timestamp,status,userID,dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    resolve(newReservation);
                }
            }
        );
    });
}



// 3.a, function to delete a food item by ID
export async function deleteReservationById(reservationID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM Reservation WHERE ReservationID = ?',
            [reservationID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting Reservation:', err.message);
                } else {
                    if (this.changes > 0) { 
                        resolve({ success: true, message: `Reservation with ID ${reservationID} deleted successfully` });
                    } else {
                        console.log(`No Reservations found with ID ${reservationID}`);
                        resolve({ success: false, message: `No Reservations found with ID ${reservationID}` });
                    }
                }
            }
        );
    });
}

// 3.c, function to update a specific item
export async function updateReservation(reservationID, updates) {
    const db = await dbConnection.openConnection();
    
    // Build the SET part of the SQL query dynamically based on provided updates
    const updateFields = [];
    const values = [];
    
    if (updates.timestamp !== undefined) {
        updateFields.push('Timestamp = ?');
        values.push(updates.timestamp);
    }
    
    if (updates.status !== undefined) {
        updateFields.push('Status = ?');
        values.push(updates.status);
    }

    if (updates.userID !== undefined) {
        updateFields.push('UserID = ?');
        values.push(updates.userID);
    }

    // If no updates provided, return early for efficiency
    if (updateFields.length === 0) {
        return Promise.resolve({ 
            success: false, 
            message: 'No updates provided' 
        });
    }
    
    // Add the ID to the values array
    values.push(establishmentID);
    
    const sql = `UPDATE Reservation SET ${updateFields.join(', ')} WHERE ReservationID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating Reservation:', err.message);
            } else {
                if (this.changes > 0) {
                    resolve({ 
                        success: true, 
                        message: `Reservation with ID ${reservationID} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No Establishment found with ID ${reservationID} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No Establishments found with ID ${reservationID} or no changes made` 
                    });
                }
            }
        });
    });
}

export default {getAllReservations,
                updateReservation,
                deleteReservationById,
                createReservation,
                searchReservationByTimestamp 
};
 
