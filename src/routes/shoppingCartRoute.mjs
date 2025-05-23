// Aggiorna il file shoppingCartRoute.mjs

import express from 'express';
import * as shoppingCartController from '../controllers/shoppingCartController.mjs';

const router = express.Router();

// Route to fetch all shopping carts
router.get('/', shoppingCartController.fetchAllShoppingCarts);

// Route to fetch shopping cart for a specific user by User ID
router.get('/:userId', shoppingCartController.fetchShoppingCartByUser);

// Route to fetch a specific item from user's shopping cart
router.get('/:userId/items/:itemId', shoppingCartController.fetchCartItem);

// Route to add a bag to a user's shopping cart
router.post('/:userId/items', shoppingCartController.addBagToUserCart);

// Route to remove a bag from a user's shopping cart
router.delete('/:userId/items/:bagId', shoppingCartController.removeBagFromUserCart);

export default router;