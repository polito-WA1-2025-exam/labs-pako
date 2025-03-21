import dbConnection from "../db/dbConnection.mjs";
import Bag from "../models/Bag.mjs";

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

export default { getAllBags, getBagsByDateRange };
