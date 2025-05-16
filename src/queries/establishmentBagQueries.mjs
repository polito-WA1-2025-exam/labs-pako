// establishmentBagQueries.mjs
import dbConnection from "../db/dbConnection.mjs";
import Bag from "../models/Bag.mjs";

// Funzione per ottenere tutti i removed items per uno specifico BagID
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

// Funzione per ottenere tutti i bag food items per uno specifico BagID
async function getAllBagFoodItems(BagID) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM BagFoodItem WHERE BagID = ?', [BagID], (err, rows) => {
            if (err) {
                reject(err);
            } else {        
                resolve(rows);
            }
        });
    });
}

// Funzione per ottenere tutti i bags di un establishment specifico
export async function getBagsByEstablishment(establishmentId) {
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
            WHERE b.EstablishmentID = ?`, 
            [establishmentId], 
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
                            content = await getAllBagFoodItems(row.BagID);
                        } catch (e) {
                            console.error("Error fetching BagFoodItems: ", e);
                        }
                        
                        // Creare un oggetto Bag
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

// Funzione per ottenere bags di un establishment in un intervallo di date specifico
export async function getBagsByEstablishmentAndDateRange(establishmentId, startDate, endDate) {
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
            WHERE b.EstablishmentID = ? AND b.TimeToPickUp BETWEEN ? AND ?`, 
            [establishmentId, startDate, endDate], 
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
                            content = await getAllBagFoodItems(row.BagID);
                        } catch (e) {
                            console.error("Error fetching BagFoodItems: ", e);
                        }
                        
                        // Creare un oggetto Bag
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

// Funzione per ottenere i bags disponibili di un establishment specifico
export async function getAvailableBagsByEstablishment(establishmentId) {
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
            WHERE b.EstablishmentID = ? AND b.State = 'available'`, 
            [establishmentId], 
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
                            content = await getAllBagFoodItems(row.BagID);
                        } catch (e) {
                            console.error("Error fetching BagFoodItems: ", e);
                        }
                        
                        // Creare un oggetto Bag
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

export default { 
    getBagsByEstablishment, 
    getBagsByEstablishmentAndDateRange, 
    getAvailableBagsByEstablishment 
};