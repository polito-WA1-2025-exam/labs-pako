import dbConnection from "../db/dbConnection.mjs";
import FoodItem from "../models/FoodItem.mjs";

// Get all food items from the database 
export async function getAllFoodItems() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM FoodItem', [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Mappa i campi del risultato del database ai campi corretti del costruttore di FoodItem
                const foodItems = rows.map(row => new FoodItem(
                    row.FoodItemID, // Mappa FoodItemID a id
                    row.Name,        // Mappa Name a name
                    row.Quantity,    // Mappa Quantity a quantity
                    row.CreationDate // Mappa CreationDate a creationDate
                ));
                resolve(foodItems);
            }
        });
    });
}
export default getAllFoodItems