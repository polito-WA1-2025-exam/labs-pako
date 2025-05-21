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

// Controller to fetch shopping cart by User ID
export const fetchShoppingCartByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        // Validate userId
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid User ID provided.' });
        }
        
        // Retrieve the shopping cart and its items for the specified user ID
        const shoppingCart = await shoppingCartService.getShoppingCartByUserId(userId);
        
        // If the shopping cart entry wasn't found (user doesn't have one yet)
        if (!shoppingCart) {
            // Return a structure indicating no cart found, but with the user ID
            return res.json({
                 userId: userId,
                 items: [],
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

// New controller to add a bag to a user's shopping cart
export const addBagToUserCart = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { bagId } = req.body;
        
        // Validate input
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid User ID provided.' });
        }
        
        if (!bagId || isNaN(parseInt(bagId))) {
            return res.status(400).json({ error: 'Valid Bag ID is required.' });
        }
        
        // Add the bag to the user's cart
        const result = await shoppingCartService.addBagToUserCart(userId, parseInt(bagId));
        
        // Return success response
        res.status(201).json(result);
    } catch (err) {
        console.error(`Error adding bag to cart for user ${req.params.userId}:`, err);
        
        // Return appropriate error responses based on the type of error
        if (err.message === 'Bag not found or not available') {
            return res.status(404).json({ error: err.message });
        }
        
        res.status(500).json({ error: `Failed to add bag to cart: ${err.message}` });
    }
};

// Export the functions
export default {
    fetchAllShoppingCarts,
    fetchShoppingCartByUser,
    addBagToUserCart
};