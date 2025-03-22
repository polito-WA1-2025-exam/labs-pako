// Import query functions to interact with the database
import shoppingCartService from '../queries/shoppingCartQueries.mjs';

// Controller to fetch all shopping carts
export const fetchAllShoppingCarts = async (req, res) => {  
    try {
        // Retrieve all shopping carts from the database
        const shoppingCarts = await shoppingCartService.getAllShoppingCarts();
        // Return the found shopping carts as JSON
        res.json(shoppingCarts);
    } catch (err) {
        console.error('Error retrieving shopping carts:', err);
        // If there's an error with the query, return a 500 error
        res.status(500).json({ error: 'Error retrieving shopping carts' });
    }
};
