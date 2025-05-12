// establishmentQueries.mjs
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
                // Potrebbe essere necessario recuperare anche le bags associate a questo establishment
                // e aggiungerle all'oggetto establishment qui.
                resolve(establishment);
            } else {
                resolve(null); // Establishment not found
            }
        });
    });
}

export default { getAllEstablishments, getEstablishmentById };