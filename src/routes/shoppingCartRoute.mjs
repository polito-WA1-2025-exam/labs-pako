import express from 'express';
import * as shoppingCartController from '../controllers/shoppingCartController.mjs';  // Import the controller

const router = express.Router();

// Existing route to fetch all shopping carts (might be removed or require auth later)
router.get('/', shoppingCartController.fetchAllShoppingCarts);

// New route to fetch shopping cart for a specific user by User ID
// This matches the client-side API call GET /api/shopping-carts/:userId
router.get('/:userId', shoppingCartController.fetchShoppingCartByUser);

export default router;