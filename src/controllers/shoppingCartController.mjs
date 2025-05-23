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

// Controller to remove a bag from user's shopping cart
export const removeBagFromUserCart = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const bagId = parseInt(req.params.bagId);
        
        // Validate input
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid User ID provided.' });
        }
        
        if (isNaN(bagId)) {
            return res.status(400).json({ error: 'Invalid Bag ID provided.' });
        }
        
        console.log(`Controller: Removing bag ${bagId} from user ${userId}'s cart`);
        
        // Remove the bag from the user's cart
        const result = await shoppingCartService.removeBagFromUserCart(userId, bagId);
        
        // Return success response
        res.json(result);
    } catch (err) {
        console.error(`Error removing bag ${req.params.bagId} from user ${req.params.userId}'s cart:`, err);
        
        // Return appropriate error responses based on the type of error
        if (err.message === 'Bag not found in user\'s cart or already removed') {
            return res.status(404).json({ error: err.message });
        }
        
        if (err.message === 'Failed to update bag state') {
            return res.status(500).json({ error: 'Failed to update bag state in database' });
        }
        
        res.status(500).json({ error: `Failed to remove bag from cart: ${err.message}` });
    }
};

// Aggiungi questo nuovo controller
export const fetchCartItem = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const itemId = parseInt(req.params.itemId);
        
        // Validate input
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid User ID provided.' });
        }
        
        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid Item ID provided.' });
        }
        
        // Retrieve the shopping cart for the user
        const shoppingCart = await shoppingCartService.getShoppingCartByUserId(userId);
        
        // Find the specific item in the cart
        const item = shoppingCart.items.find(item => item.id === itemId);
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found in user cart' });
        }
        
        // Return the found item
        res.json(item);
    } catch (err) {
        console.error(`Error retrieving item ${req.params.itemId} from user ${req.params.userId}'s cart:`, err);
        res.status(500).json({ error: `Error retrieving item from cart: ${err.message}` });
    }
};

// Non dimenticare di aggiungerlo al default export:
export default {
    fetchAllShoppingCarts,
    fetchShoppingCartByUser,
    fetchCartItem,  // <-- Aggiungi questa linea
    addBagToUserCart,
    removeBagFromUserCart
};