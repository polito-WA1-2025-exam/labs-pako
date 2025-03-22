import express from 'express';
import * as reservationController from '../controllers/reservationController.mjs';

const router = express.Router();

// route to fetch all reservations
router.get('/', reservationController.fetchAllReservations);

// Here you can add more routes for other operations like create, update, delete, etc.

export default router;
