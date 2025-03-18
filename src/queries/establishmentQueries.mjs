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
export default {getAllEstablishments}; 
// Previously, we used `export default getAllEstablishments;`, which allowed importing the function directly without `{ }`.
// Now, we are exporting an object with `export default { getAllEstablishments };`, 
// so the function must be accessed as a property (e.g., `establishmentService.getAllEstablishments()`).
// This change ensures scalability if we want to add more functions in the future.