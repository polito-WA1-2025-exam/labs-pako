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

// Controller to fetch a reservation by its ID
export const fetchReservationById = async (req, res) => {  
    const { id } = req.params;  // Get the ID from the request parameters

    if (!id) {
        return res.status(400).json({ error: 'Reservation ID is required' }); // Return an error if ID is not provided
    }

    try {
        // Fetch the reservation by ID using the query function
        const reservation = await reservationService.getReservationById(id);

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' }); // Return an error if the reservation does not exist
        }

        // Return the reservation as a JSON response
        res.json(reservation);
    } catch (err) {
        console.error('Error fetching the reservation:', err); // Log any errors
        res.status(500).json({ error: 'Internal server error' }); // Return a 500 error if something goes wrong with the database query
    }
};

// Add more functions for other operations (create, update, delete, etc.)
