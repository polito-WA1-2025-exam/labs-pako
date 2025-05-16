// Import query functions to interact with the database
import shoppingCartService from '../queries/shoppingCartQueries.mjs';

// Controller to fetch all shopping carts (existing)
export const fetchAllShoppingCarts = async (req, res) => {
    try {
        // Retrieve all shopping carts from the database
        const shoppingCarts = await shoppingCartService.getAllShoppingCarts();
        // Return the found shopping carts as JSON
        res.json(shoppingCarts);
    } catch (err) {
        console.error('Error retrieving all shopping carts:', err);
        // If there's an error with the query, return a 500 error
        res.status(500).json({ error: 'Error retrieving all shopping carts' });
    }
};

// New Controller to fetch shopping cart by User ID
export const fetchShoppingCartByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId); // Extract userId from URL parameters and parse as integer

        // Validate userId
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid User ID provided.' });
        }

        // Retrieve the shopping cart and its items for the specified user ID
        const shoppingCart = await shoppingCartService.getShoppingCartByUserId(userId);

        // If the shopping cart entry wasn't found (user doesn't have one yet)
        if (!shoppingCart) {
            // Return a structure indicating no cart found, but with the user ID
            // A 404 could also be valid, but returning an empty structure is often more user-friendly for a cart
            return res.json({
                 userId: userId,
                 items: [], // No items if no cart entry or no bags
                 allergies: [],
                 requests: []
            });
        }

        // Return the found shopping cart (which includes items) as JSON
        res.json(shoppingCart);

    } catch (err) {
        console.error(`Error retrieving shopping cart for user ${req.params.userId}:`, err);
        // If there's an error with the query, return a 500 error
        res.status(500).json({ error: `Error retrieving shopping cart for user ${req.params.userId}` });
    }
};

// Export the new function