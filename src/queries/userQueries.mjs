import dbConnection from "../db/dbConnection.mjs";
import User from "../models/User.mjs";

// Get all users items from the database 
export async function getAllUsers() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM User', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {        
                // Map fields of result from database to fields of Users constructor
                const users = rows.map(row => new User(
                    row.UserID,         
                    row.Username,       
                    row.Email,          
                    row.CreationDate,    
                    row.Password       
                ));
                resolve(users);
            }
        });
    });
}


export async function createUser(username,mail,password) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO Bag (username,mail,password) VALUES (?, ?, ?)',
            [username,mail,password],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating food item:', err.message);
                } else {
                    console.log(`Food item created successfully with ID: ${this.lastID}`);
                    const newUser = new User(this.lastID,username,mail,password,dayjs().format('YYYY-MM-DD HH:mm:ss'));
                    resolve(newUser);
                }
            }
        );
    });
}


// 3.a, function to delete a Bag by ID
export async function deleteUserById(userID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM User WHERE UserID = ?',
            [bagID],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting User', err.message);
                } else {
                    if (this.changes > 0) { 
                        resolve({ success: true, message: `User with ID ${userID} deleted successfully` });
                    } else {
                        console.log(`No food item found with ID ${foodItemId}`);
                        resolve({ success: false, message: `No food item found with ID ${userID}` });
                    }
                }
            }
        );
    });
}


// 3.c, function to update a specific item
export async function updateUser(userID, updates) {
    const db = await dbConnection.openConnection();
    
    const updateFields = [];
    const values = [];
    
    if (updates.name !== undefined) {
        updateFields.push('Name = ?');
        values.push(updates.name);
    }
    
    if (updates.password !== undefined) {
        updateFields.push('Password = ?');
        values.push(updates.password);
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
    
    values.push(userID);
    
    const sql = `UPDATE User SET ${updateFields.join(', ')} WHERE UserID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating User', err.message);
            } else {
                if (this.changes > 0) {
                    resolve({ 
                        success: true, 
                        message: `User with ID ${userID} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No User found with ID ${userID} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No User found with ID ${userID} or no changes made` 
                    });
                }
            }
        });
    });
}


export default {getAllUsers,
                deleteUserById,
                createUser,
                updateUser
};