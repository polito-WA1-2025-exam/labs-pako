import express from 'express';
import * as foodItemController from '../controllers/foodItemController.mjs';  // Import the controller

const router = express.Router();

// Map routes to controller methods
router.get('/', foodItemController.fetchAllFoodItems); // Get all food items
router.get('/search', foodItemController.searchFoodItemsByNameController);  // Search by name
router.get('/:id', foodItemController.fetchFoodItemById);  // Get food item by id
router.post('/', foodItemController.createFoodItemController);  // Create a new food item
router.put('/:id', foodItemController.updateFoodItemController);  // Update food item
router.delete('/:id', foodItemController.deleteFoodItemController);  // Delete food item

export default router;
