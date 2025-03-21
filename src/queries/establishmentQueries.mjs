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
                    row.Name,            // Map Name to name
                    row.Address,         // Map Address to address
                    row.PhoneNumber,     // Map PhoneNumber to phoneNumber
                    row.Category,        // Map Category to category
                    row.Type,            // Map Type to type
                    row.Content,         // Map Content to content
                    row.CreationDate     // Map CreationDate to creationDate
                ))
                resolve(establishments);
            }
        });
    });
}


// 2.b, function for searching for Establishments matching with name substring
export async function searchEstablishmetByName(nameSubstring) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Establishment WHERE Name LIKE ?', [`%${nameSubstring}%`], (err, rows) => { //LIKE operator is used for pattern matching
            if (err) {
                reject(err);
            } else {
                const establishments = rows.map(row => new Establishment(
                    row.EstablishmentID, 
                    row.Name,           
                    row.Address,      
                    row.PhoneNumber,    
                    row.Category,       
                    row.Type,        
                    row.Content,      
                    row.CreationDate    
                ))
                resolve(establishments);
            }
        });
    });
}



// 3.a, function to create and store a new food item
export async function createEstablishment(name, quantity) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO Establishment (Name, Address,PhoneNumber,Category,Type,BagContentID) VALUES (?, ?, ?, ?, ?, ?)',
            [name, address, phoneNumber, Category, Type,BagContentID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating food item:', err.message);
                } else {
                    console.log(`Food item created successfully with ID: ${this.lastID}`);
                    const newFoodItem = new FoodItem(this.lastID, name, quantity, dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    resolve(newFoodItem);
                }
            }
        );
    });
}



// 3.a, function to delete a food item by ID
export async function deleteEstablishmentById(establishmentID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM Establishment WHERE EstablishmentID = ?',
            [establishmentID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting Establishment:', err.message);
                } else {
                    if (this.changes > 0) { //this.changes is the number of rows affected by the operation
                        // Commented out the console.log to avoid duplicate printing of the success message. 
                        // The success message is already included in the resolve() response, 
                        // so logging it again would be redundant and could clutter the logs.
                        //console.log(`Food item with ID ${foodItemId} deleted successfully`);
                        resolve({ success: true, message: `Establishment with ID ${establishmentID} deleted successfully` });
                    } else {
                        console.log(`No food item found with ID ${foodItemId}`);
                        resolve({ success: false, message: `No Establishments found with ID ${establishmentID}` });
                    }
                }
            }
        );
    });
}

// 3.c, function to update a specific item
export async function updateEstablishment(establishmentID, updates) {
    const db = await dbConnection.openConnection();
    
    // Build the SET part of the SQL query dynamically based on provided updates
    const updateFields = [];
    const values = [];
    
    if (updates.name !== undefined) {
        updateFields.push('Name = ?');
        values.push(updates.name);
    }
    
    if (updates.address !== undefined) {
        updateFields.push('Address = ?');
        values.push(updates.address);
    }

    if (updates.number !== undefined) {
        updateFields.push('PhoneNumber = ?');
        values.push(updates.number);
    }

    if (updates.type !== undefined) {
        updateFields.push('Type = ?');
        values.push(updates.type);
    }

    if (updates.category !== undefined) {
        updateFields.push('Category = ?');
        values.push(updates.category);
    }

    //TODO: Update Bags -> HOW?
    
    // If no updates provided, return early for efficiency
    if (updateFields.length === 0) {
        return Promise.resolve({ 
            success: false, 
            message: 'No updates provided' 
        });
    }
    
    // Add the ID to the values array
    values.push(establishmentID);
    
    const sql = `UPDATE Establishment SET ${updateFields.join(', ')} WHERE EstablishmentID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating Establishment:', err.message);
            } else {
                if (this.changes > 0) {
                    resolve({ 
                        success: true, 
                        message: `Establishment with ID ${establishmentID} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No Establishment found with ID ${establishmentID} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No Establishments found with ID ${establishmentID} or no changes made` 
                    });
                }
            }
        });
    });
}

// 3.c, function to update quantity for multiple food items wrt given condition
export async function updateMultipleEstablishmentAddress(quantityChange, condition) {
    const db = await dbConnection.openConnection();
    
    let sql = 'UPDATE Establishment SET Address = Address + ?';
    const values = [quantityChange];
    
    if (condition) {
        sql += ` WHERE ${condition.field} ${condition.operator} ?`;
        values.push(condition.value);
    }
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating Establishment:', err.message);
            } else {
                console.log(`${this.changes} Establishments updated successfully`);
                resolve({ 
                    success: true, 
                    message: `${this.changes} Establishments updated successfully`,
                    changes: this.changes
                });
            }
        });
    });
}





export default {getAllEstablishments,
                updateEstablishment,
                updateMultipleEstablishmentAddress,
                deleteEstablishmentById,
                createEstablishment,
                searchEstablishmetByName 
}; 
