import express from 'express';
import * as shoppingCartController from '../controllers/shoppingCartController.mjs';  // Import the controller

const router = express.Router();

router.get('/', shoppingCartController.fetchAllShoppingCarts); // Route to fetch all shopping carts

export default router;
