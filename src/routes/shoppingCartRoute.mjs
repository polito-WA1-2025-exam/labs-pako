import express from 'express';
import * as shoppingCartController from '../controllers/shoppingCartController.mjs';

const router = express.Router();

// Route to fetch all shopping carts
router.get('/', shoppingCartController.fetchAllShoppingCarts);

// Route to fetch shopping cart for a specific user by User ID
router.get('/:userId', shoppingCartController.fetchShoppingCartByUser);

// New route to add a bag to a user's shopping cart
router.post('/:userId/items', shoppingCartController.addBagToUserCart);

export default router;