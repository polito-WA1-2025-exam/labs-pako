// Import the function from the service to get all establishments
import establishmentService from '../queries/establishmentQueries.mjs';

// Controller to fetch all establishments
export const fetchAllEstablishments = async (req, res) => {
    try {
        // Fetch all establishments
        const establishments = await establishmentService.getAllEstablishments();
        // Return the establishments as a JSON response
        res.json(establishments);
    } catch (err) {
        // If an error occurs during the query, return a 500 error with a message
        res.status(500).json({ error: 'Error retrieving establishments' });
    }
};

// Add more functions for other operations (create, update, delete, etc.)
