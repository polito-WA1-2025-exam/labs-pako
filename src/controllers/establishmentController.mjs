// establishmentController.mjs
// Import the function from the service to get all establishments and a single establishment
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

// Controller to fetch a single establishment by ID
export const fetchEstablishmentById = async (req, res) => {
    try {
        const id = req.params.id; // Get the ID from the URL parameters
        const establishment = await establishmentService.getEstablishmentById(id);
        if (establishment) {
            res.json(establishment);
        } else {
            res.status(404).json({ message: 'Establishment not found' });
        }
    } catch (err) {
        console.error(`Error retrieving establishment with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Error retrieving establishment' });
    }
};

// Add more functions for other operations (create, update, delete, etc.)