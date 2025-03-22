import reservationService from '../queries/reservationQueries.mjs';

// Controller to fetch all reservations
export const fetchAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.json(reservations);
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).json({ error: 'Error retrieving reservations' });
    }
};

// Add more functions for other operations (create, update, delete, etc.)
