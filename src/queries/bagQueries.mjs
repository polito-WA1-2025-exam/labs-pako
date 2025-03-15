import dbConnection from "../db/dbConnection.mjs";
import User from "../models/User.mjs";
import Establishment from "../models/Establishment.mjs";
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
                b.Content,
                b.Price, 
                b.EstablishmentID, 
                b.TimeToPickUp, 
                b.State, 
                b.RemovedItems, 
                u.UserID as UserID, 
                u.Username as UserName,  
                u.Email as UserEmail
            FROM Bag b
            LEFT JOIN User u ON b.UserID = u.UserID`, 
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

                        // Create a Bag object
                        const bag = new Bag(
                            row.BagID,
                            row.Type,        
                            row.Size, 
                            row.Content, // TODO: add array of fooditems
                            row.Price,
                            row.EstablishmentID,
                            row.TimeToPickUp,
                            row.State,
                            row.UserID,
                            removedItems,  // Pass removedItems to the bag object
                            row.CreationDate
                        );

                        // Create a User object
                        const user = new User(row.UserID, row.UserName, row.UserEmail);
                        
                        // Create an Establishment object
                        const establishment = new Establishment(
                            row.EstablishmentID,
                            row.EstablishmentName,
                            row.EstablishmentAddress,
                            row.EstablishmentPhoneNumber,
                            row.EstablishmentCategory,
                            row.EstablishmentType
                        );

                        // Add the user and establishment to the bag
                        bag.user = user;
                        bag.establishment = establishment;

                        return bag; // Return the bag with the user and establishment associated
                    }));

                    resolve(bags); // Resolve with the bags array
                }
            }
        );
    });
}

export default getAllBags;
