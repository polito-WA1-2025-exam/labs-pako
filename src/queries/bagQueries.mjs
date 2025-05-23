import dbConnection from "../db/dbConnection.mjs";
import Bag from "../models/Bag.mjs";
import dayjs from 'dayjs';

// TODO: implemented api call for all removed items ?
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
// TODO: implemented api call for all bag food items ?
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

// Function to create a new bag in the database
export async function createBag(bagData) {
    const db = await dbConnection.openConnection();
    
    try {
        return new Promise((resolve, reject) => {
            // Start a transaction to ensure data consistency
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                
                // Insert the bag into the Bag table
                db.run(
                    `INSERT INTO Bag (BagID, Type, Size, Price, EstablishmentID, TimeToPickUp, State, UserID) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        bagData.id,
                        bagData.type,
                        bagData.size,
                        bagData.price,
                        bagData.establishmentId,
                        bagData.timeToPickUp,
                        bagData.state || 'available',
                        bagData.userId || null
                    ],
                    function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        
                        // If the bag is regular and has content, insert into BagFoodItem table
                        if (bagData.type === 'regular' && bagData.content && bagData.content.length > 0) {
                            const insertPromises = bagData.content.map(item => {
                                return new Promise((resolveItem, rejectItem) => {
                                    db.run(
                                        'INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES (?, ?, ?)',
                                        [bagData.id, item.FoodItemID, item.Quantity],
                                        function(itemErr) {
                                            if (itemErr) {
                                                rejectItem(itemErr);
                                            } else {
                                                resolveItem();
                                            }
                                        }
                                    );
                                });
                            });
                            
                            Promise.all(insertPromises)
                                .then(() => {
                                    db.run('COMMIT');
                                    
                                    // Create and return the new Bag object
                                    const newBag = new Bag(
                                        bagData.id,
                                        bagData.type,
                                        bagData.size,
                                        bagData.content || [],
                                        bagData.price,
                                        bagData.establishmentId,
                                        bagData.timeToPickUp,
                                        bagData.state || 'available',
                                        bagData.userId || null,
                                        [], // removedItems starts empty
                                        dayjs().format('YYYY-MM-DD HH:mm:ss')
                                    );
                                    
                                    resolve(newBag);
                                })
                                .catch(itemErr => {
                                    db.run('ROLLBACK');
                                    reject(itemErr);
                                });
                        } else {
                            // For surprise bags or regular bags without content
                            db.run('COMMIT');
                            
                            const newBag = new Bag(
                                bagData.id,
                                bagData.type,
                                bagData.size,
                                [],
                                bagData.price,
                                bagData.establishmentId,
                                bagData.timeToPickUp,
                                bagData.state || 'available',
                                bagData.userId || null,
                                [],
                                dayjs().format('YYYY-MM-DD HH:mm:ss')
                            );
                            
                            resolve(newBag);
                        }
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error creating bag:', error);
        throw error;
    }
}

// Function to delete a bag and all its related records
export async function deleteBag(bagId) {
    const db = await dbConnection.openConnection();
    
    try {
        return new Promise((resolve, reject) => {
            // Start a transaction to ensure data consistency
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                
                // Step 1: Delete from RemovedItems table
                db.run(
                    'DELETE FROM RemovedItems WHERE BagID = ?',
                    [bagId],
                    function(err) {
                        if (err) {
                            console.error('Error deleting from RemovedItems:', err);
                            db.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                        console.log(`Deleted ${this.changes} records from RemovedItems for BagID ${bagId}`);
                        
                        // Step 2: Delete from BagFoodItem table
                        db.run(
                            'DELETE FROM BagFoodItem WHERE BagID = ?',
                            [bagId],
                            function(err) {
                                if (err) {
                                    console.error('Error deleting from BagFoodItem:', err);
                                    db.run('ROLLBACK');
                                    reject(err);
                                    return;
                                }
                                console.log(`Deleted ${this.changes} records from BagFoodItem for BagID ${bagId}`);
                                
                                // Step 3: Delete from Reservation table
                                db.run(
                                    'DELETE FROM Reservation WHERE BagID = ?',
                                    [bagId],
                                    function(err) {
                                        if (err) {
                                            console.error('Error deleting from Reservation:', err);
                                            db.run('ROLLBACK');
                                            reject(err);
                                            return;
                                        }
                                        console.log(`Deleted ${this.changes} records from Reservation for BagID ${bagId}`);
                                        
                                        // Step 4: Finally, delete from Bag table
                                        db.run(
                                            'DELETE FROM Bag WHERE BagID = ?',
                                            [bagId],
                                            function(err) {
                                                if (err) {
                                                    console.error('Error deleting from Bag:', err);
                                                    db.run('ROLLBACK');
                                                    reject(err);
                                                    return;
                                                }
                                                
                                                if (this.changes === 0) {
                                                    db.run('ROLLBACK');
                                                    reject(new Error(`Bag with ID ${bagId} not found`));
                                                    return;
                                                }
                                                
                                                console.log(`Successfully deleted bag with ID ${bagId}`);
                                                db.run('COMMIT');
                                                resolve({ 
                                                    success: true, 
                                                    message: `Bag ${bagId} and all related records deleted successfully`,
                                                    deletedBagId: bagId
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    } catch (error) {
        console.error('Error in deleteBag function:', error);
        throw error;
    }
}

export async function updateBagStatus(bagId, status) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE Bag SET State = ? WHERE BagID = ?`,
            [status, bagId],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            }
        );
    });
}

// Aggiorna anche l'export default alla fine del file
export default { getAllBags, getBagsByDateRange, createBag, deleteBag, updateBagStatus };
