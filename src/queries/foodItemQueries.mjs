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
                // Map fields of result from database to fields of FoodItem constructor
                const foodItems = rows.map(row => new FoodItem(
                    row.FoodItemID,  // Map fooditem to id
                    row.Name,        // Map name to name
                    row.Quantity,    // Map Quantity to quantity
                    row.CreationDate // Map CreationDate to creationDate
                ));
                resolve(foodItems);
            }
        });
    });
}
export default getAllFoodItems