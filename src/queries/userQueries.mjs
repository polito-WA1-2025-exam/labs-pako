import dbConnection from "../db/dbConnection.mjs";
import User from "../models/User.mjs";

// Get all establishment items from the database 
export async function getAllUsers() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM User', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {        
                // Map fields of result from database to fields of Users constructor
                const users = rows.map(row => new User(
                    row.UserID,          // Map UserID to id
                    row.Name,            // Map Name to name
                    row.Email,           // Map Email to email
                    row.CreationDate     // Map CreationDate to creationDate
                ));
                resolve(users);
            }
        });
    });
}
export default getAllUsers