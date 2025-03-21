// Import query functions to interact with the database
import { getAllFoodItems, searchFoodItemsByName, createFoodItem, deleteFoodItemById, updateFoodItem, getFoodItemById } from '../queries/foodItemQueries.mjs';

// Controller to fetch all food items from the database
export const fetchAllFoodItems = async (req, res) => {  
    try {
        // Get all food items using the query function
        const foodItems = await getAllFoodItems();  
        // Return the fetched food items as a JSON response
        res.json(foodItems);
    } catch (err) {
        // If an error occurs during the database query, return a 500 status with an error message
        res.status(500).json({ error: 'Database error' });
    }
};

// Controller to search food items by name (using query parameters)
export const searchFoodItemsByNameController = async (req, res) => { 
    // Destructure the 'name' query parameter from the request
    const { name } = req.query;
    // If 'name' is provided, perform the search
    if (name) {
        try {
            // Use the query function to search food items by name
            const foodItems = await searchFoodItemsByName(name);
            // Return the search results as a JSON response
            res.json(foodItems);
        } catch (err) {
            // If an error occurs during the search query, return a 500 status with an error message
            res.status(500).json({ error: 'Database error' });
        }
    } else {
        // If 'name' query parameter is missing, return a 400 status with an error message
        res.status(400).json({ error: 'Name parameter is required' });
    }
};

// Controller to fetch a single food item by its ID
export const fetchFoodItemById = async (req, res) => {  
    // Destructure the 'id' parameter from the request
    const { id } = req.params;
    try {
        // Use the query function to get a food item by its ID
        const foodItem = await getFoodItemById(id);
        // If the food item is found, return it as a JSON response
        if (foodItem) {
            res.json(foodItem);
        } else {
            // If the food item is not found, return a 404 status with a not-found error message
            res.status(404).json({ error: `Food item with ID ${id} not found` });
        }
    } catch (err) {
        // If an error occurs during the database query, return a 500 status with an error message
        res.status(500).json({ error: 'Database error' });
    }
};

// Controller to create a new food item
export const createFoodItemController = async (req, res) => {  
    // Destructure 'name' and 'quantity' from the request body
    const { name, quantity } = req.body;
    // If 'name' or 'quantity' is missing, return a 400 status with an error message
    if (!name || !quantity) {
        return res.status(400).json({ error: 'Name and quantity are required' });
    }
    try {
        // Use the query function to create a new food item in the database
        const newFoodItem = await createFoodItem(name, quantity);
        // Return the newly created food item with a 201 status (created)
        res.status(201).json(newFoodItem);
    } catch (err) {
        // If an error occurs during creation, return a 500 status with an error message
        res.status(500).json({ error: 'Failed to create food item' });
    }
};

// Controller to update an existing food item
export const updateFoodItemController = async (req, res) => {  
    // Destructure 'id' from the request parameters and 'updates' from the request body
    const { id } = req.params;
    const updates = req.body;
    try {
        // Use the query function to update the food item in the database
        const result = await updateFoodItem(id, updates);
        // Return the updated result as a JSON response
        res.json(result);
    } catch (err) {
        // If an error occurs during the update, return a 500 status with an error message
        res.status(500).json({ error: 'Failed to update food item' });
    }
};

// Controller to delete a food item by its ID
export const deleteFoodItemController = async (req, res) => {  
    // Destructure 'id' from the request parameters
    const { id } = req.params;
    try {
        // Use the query function to delete the food item from the database
        const result = await deleteFoodItemById(id);
        // Return the result of the deletion as a JSON response
        res.json(result);
    } catch (err) {
        // If an error occurs during deletion, return a 500 status with an error message
        res.status(500).json({ error: 'Failed to delete food item' });
    }
};
