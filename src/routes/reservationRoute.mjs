import express from 'express';
import * as reservationController from '../controllers/reservationController.mjs';

const router = express.Router();

router.get('/', reservationController.fetchAllReservations); // Route to fetch all reservations
router.get('/:id', reservationController.fetchReservationById); // Route to fetch a reservation by its ID

// Here you can add more routes for other operations like create, update, delete, etc.

export default router;
