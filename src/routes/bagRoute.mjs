import express from 'express';
import * as bagController from '../controllers/bagController.mjs';  // Import the bag controller

const router = express.Router();

// Map routes to controller methods
router.get('/', bagController.fetchAllBags);  // Get all bags
router.get('/by-date-range', bagController.fetchBagsByDateRange);  // Get bags based on the date range
router.post('/', bagController.createBag);  // Create a new bag
router.delete('/:id', bagController.deleteBag);  // Delete a bag by ID

export default router;