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

// 2.b, function for searching for food items matching with name substring
export async function searchFoodItemsByName(nameSubstring) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM FoodItem WHERE Name LIKE ?', [`%${nameSubstring}%`], (err, rows) => { //LIKE operator is used for pattern matching
            if (err) {
                reject(err);
            } else {
                const foodItems = rows.map(row => new FoodItem(
                    row.FoodItemID,
                    row.Name,
                    row.Quantity,
                    row.CreationDate
                ));
                resolve(foodItems);
            }
        });
    });
}

// 3.a, function to create and store a new food item
export async function createFoodItem(name, quantity) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO FoodItem (Name, Quantity) VALUES (?, ?)',
            [name, quantity],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error creating food item:', err.message);
                } else {
                    console.log(`Food item created successfully with ID: ${this.lastID}`);
                    resolve({
                        id: this.lastID,
                        name,
                        quantity,
                        creationDate: new Date().toISOString()
                    });
                }
            }
        );
    });
}

// 3.a, function to delete a food item by ID
export async function deleteFoodItemById(foodItemId) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM FoodItem WHERE FoodItemID = ?',
            [foodItemId],
            function(err) {
                if (err) {
                    reject(err);
                    console.error('Error deleting food item:', err.message);
                } else {
                    if (this.changes > 0) { //this.changes is the number of rows affected by the operation
                        console.log(`Food item with ID ${foodItemId} deleted successfully`);
                        resolve({ success: true, message: `Food item with ID ${foodItemId} deleted successfully` });
                    } else {
                        console.log(`No food item found with ID ${foodItemId}`);
                        resolve({ success: false, message: `No food item found with ID ${foodItemId}` });
                    }
                }
            }
        );
    });
}

// 3.c, function to update a specific item
export async function updateFoodItem(foodItemId, updates) {
    const db = await dbConnection.openConnection();
    
    // Build the SET part of the SQL query dynamically based on provided updates
    const updateFields = [];
    const values = [];
    
    if (updates.name !== undefined) {
        updateFields.push('Name = ?');
        values.push(updates.name);
    }
    
    if (updates.quantity !== undefined) {
        updateFields.push('Quantity = ?');
        values.push(updates.quantity);
    }
    
    // If no updates provided, return early for efficiency
    if (updateFields.length === 0) {
        return Promise.resolve({ 
            success: false, 
            message: 'No updates provided' 
        });
    }
    
    // Add the ID to the values array
    values.push(foodItemId);
    
    const sql = `UPDATE FoodItem SET ${updateFields.join(', ')} WHERE FoodItemID = ?`;
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating food item:', err.message);
            } else {
                if (this.changes > 0) {
                    console.log(`Food item with ID ${foodItemId} updated successfully`);
                    resolve({ 
                        success: true, 
                        message: `Food item with ID ${foodItemId} updated successfully`,
                        changes: this.changes
                    });
                } else {
                    console.log(`No food item found with ID ${foodItemId} or no changes made`);
                    resolve({ 
                        success: false, 
                        message: `No food item found with ID ${foodItemId} or no changes made` 
                    });
                }
            }
        });
    });
}

// 3.c, function to update quantity for multiple food items wrt given condition
export async function updateMultipleFoodItemsQuantity(quantityChange, condition) {
    const db = await dbConnection.openConnection();
    
    let sql = 'UPDATE FoodItem SET Quantity = Quantity + ?';
    const values = [quantityChange];
    
    if (condition) {
        sql += ` WHERE ${condition.field} ${condition.operator} ?`;
        values.push(condition.value);
    }
    
    return new Promise((resolve, reject) => {
        db.run(sql, values, function(err) {
            if (err) {
                reject(err);
                console.error('Error updating food items:', err.message);
            } else {
                console.log(`${this.changes} food items updated successfully`);
                resolve({ 
                    success: true, 
                    message: `${this.changes} food items updated successfully`,
                    changes: this.changes
                });
            }
        });
    });
}

export default { 
    getAllFoodItems, 
    searchFoodItemsByName, 
    createFoodItem, 
    deleteFoodItemById,
    updateFoodItem,
    updateMultipleFoodItemsQuantity
};