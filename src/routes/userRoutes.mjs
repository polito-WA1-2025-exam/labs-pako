import express from 'express';
import * as userController from '../controllers/userController.mjs';  // Import the user controller

const router = express.Router();

// Map routes to the controller functions
router.get('/', userController.fetchAllUsers);  // Get all users

export default router;
