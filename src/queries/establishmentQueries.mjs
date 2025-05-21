import dbConnection from "../db/dbConnection.mjs";
import Establishment from "../models/Establishment.mjs";

// Get all establishment items from the database
export async function getAllEstablishments() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Establishment', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Map fields of result from database to fields of Establishment constructor
                const establishments = rows.map(row => new Establishment(
                    row.EstablishmentID, // Map EstablishmentID to id
                    row.Name,             // Map Name to name
                    row.Address,          // Map Address to address
                    row.PhoneNumber,      // Map PhoneNumber to phoneNumber
                    row.Category,         // Map Category to category
                    row.Type,             // Map Type to type
                    row.Content,          // Map Content to content
                    row.CreationDate      // Map CreationDate to creationDate
                ));
                resolve(establishments);
            }
        });
    });
}

// Get a single establishment by its ID from the database
export async function getEstablishmentById(id) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Establishment WHERE EstablishmentID = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                // Map fields of result from database to fields of Establishment constructor
                const establishment = new Establishment(
                    row.EstablishmentID, // Map EstablishmentID to id
                    row.Name,             // Map Name to name
                    row.Address,          // Map Address to address
                    row.PhoneNumber,      // Map PhoneNumber to phoneNumber
                    row.Category,         // Map Category to category
                    row.Type,             // Map Type to type
                    row.Content,          // Map Content to content
                    row.CreationDate      // Map CreationDate to creationDate
                );
                resolve(establishment);
            } else {
                resolve(null); // Establishment not found
            }
        });
    });
}

// Create a new establishment in the database
export async function createEstablishment(establishmentData) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        const { name, address, phoneNumber, category, type, content } = establishmentData;
        
        db.run(
            'INSERT INTO Establishment (Name, Address, PhoneNumber, Category, Type, Content) VALUES (?, ?, ?, ?, ?, ?)',
            [name, address, phoneNumber, category, type, content],
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Get the newly created establishment with its assigned ID
                    getEstablishmentById(this.lastID)
                        .then(newEstablishment => resolve(newEstablishment))
                        .catch(err => reject(err));
                }
            }
        );
    });
}

// Update an existing establishment in the database
export async function updateEstablishment(id, establishmentData) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        const { name, address, phoneNumber, category, type, content } = establishmentData;
        
        db.run(
            'UPDATE Establishment SET Name = ?, Address = ?, PhoneNumber = ?, Category = ?, Type = ?, Content = ? WHERE EstablishmentID = ?',
            [name, address, phoneNumber, category, type, content, id],
            function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null); // Establishment not found
                } else {
                    // Get the updated establishment
                    getEstablishmentById(id)
                        .then(updatedEstablishment => resolve(updatedEstablishment))
                        .catch(err => reject(err));
                }
            }
        );
    });
}

// Delete an establishment from the database
export async function deleteEstablishment(id) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        // Start a transaction to ensure referential integrity
        db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
                return reject(err);
            }

            // Check if the establishment exists
            db.get('SELECT EstablishmentID FROM Establishment WHERE EstablishmentID = ?', [id], (err, row) => {
                if (err) {
                    db.run('ROLLBACK', () => {
                        reject(err);
                    });
                } else if (!row) {
                    db.run('ROLLBACK', () => {
                        resolve(false); // Establishment not found
                    });
                } else {
                    // First, check if there are any references to this establishment in other tables
                    db.get('SELECT BagID FROM Bag WHERE EstablishmentID = ? LIMIT 1', [id], (err, bagRow) => {
                        if (err) {
                            return db.run('ROLLBACK', () => {
                                reject(err);
                            });
                        }
                        
                        // If there are related bags, clean them up manually to avoid constraint issues
                        if (bagRow) {
                            const cleanupBags = () => {
                                // Delete related BagFoodItem records
                                db.run('DELETE FROM BagFoodItem WHERE BagID IN (SELECT BagID FROM Bag WHERE EstablishmentID = ?)', [id], (err) => {
                                    if (err) {
                                        return db.run('ROLLBACK', () => {
                                            reject(new Error(`Failed to delete related BagFoodItem records: ${err.message}`));
                                        });
                                    }
                                    
                                    // Delete related RemovedItems records
                                    db.run('DELETE FROM RemovedItems WHERE BagID IN (SELECT BagID FROM Bag WHERE EstablishmentID = ?)', [id], (err) => {
                                        if (err) {
                                            return db.run('ROLLBACK', () => {
                                                reject(new Error(`Failed to delete related RemovedItems records: ${err.message}`));
                                            });
                                        }
                                        
                                        // Delete related ShoppingCart records via Reservation
                                        db.run('DELETE FROM ShoppingCart WHERE ReservationID IN (SELECT ReservationID FROM Reservation WHERE BagID IN (SELECT BagID FROM Bag WHERE EstablishmentID = ?))', [id], (err) => {
                                            if (err) {
                                                return db.run('ROLLBACK', () => {
                                                    reject(new Error(`Failed to delete related ShoppingCart records: ${err.message}`));
                                                });
                                            }
                                            
                                            // Delete related Reservation records
                                            db.run('DELETE FROM Reservation WHERE BagID IN (SELECT BagID FROM Bag WHERE EstablishmentID = ?)', [id], (err) => {
                                                if (err) {
                                                    return db.run('ROLLBACK', () => {
                                                        reject(new Error(`Failed to delete related Reservation records: ${err.message}`));
                                                    });
                                                }
                                                
                                                // Delete related Bag records
                                                db.run('DELETE FROM Bag WHERE EstablishmentID = ?', [id], (err) => {
                                                    if (err) {
                                                        return db.run('ROLLBACK', () => {
                                                            reject(new Error(`Failed to delete related Bag records: ${err.message}`));
                                                        });
                                                    }
                                                    
                                                    // Now it's safe to delete the establishment
                                                    finalizeEstablishmentDeletion();
                                                });
                                            });
                                        });
                                    });
                                });
                            };
                            
                            // Call the cleanup function
                            cleanupBags();
                        } else {
                            // No related bags, safe to delete directly
                            finalizeEstablishmentDeletion();
                        }
                        
                        // Helper function to delete the establishment after all dependencies are handled
                        function finalizeEstablishmentDeletion() {
                            db.run('DELETE FROM Establishment WHERE EstablishmentID = ?', [id], function(err) {
                                if (err) {
                                    return db.run('ROLLBACK', () => {
                                        reject(new Error(`Failed to delete establishment: ${err.message}`));
                                    });
                                }
                                
                                // If no rows were affected, the establishment might have been deleted elsewhere
                                if (this.changes === 0) {
                                    return db.run('ROLLBACK', () => {
                                        resolve(false); // No establishment found to delete
                                    });
                                }
                                
                                // Commit the transaction
                                db.run('COMMIT', (err) => {
                                    if (err) {
                                        return db.run('ROLLBACK', () => {
                                            reject(new Error(`Failed to commit transaction: ${err.message}`));
                                        });
                                    }
                                    
                                    // Success! The establishment and all related records have been deleted
                                    resolve(true);
                                });
                            });
                        }
                    });
                }
            });
        });
    });
}