import express from 'express';
import * as establishmentController from '../controllers/establishmentController.mjs'; // Import the controller

const router = express.Router();

// Map routes to the controller
router.get('/', establishmentController.fetchAllEstablishments);  // Get all establishments
// Add more routes for operations like creation, update, deletion, etc.

export default router;
