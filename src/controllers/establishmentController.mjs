// Import the function from the service to get all establishments and a single establishment
import * as establishmentService from '../queries/establishmentQueries.mjs';

// Controller to fetch all establishments
export const fetchAllEstablishments = async (req, res) => {
    try {
        // Fetch all establishments
        const establishments = await establishmentService.getAllEstablishments();
        // Return the establishments as a JSON response
        res.json(establishments);
    } catch (err) {
        console.error('Error retrieving establishments:', err);
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

// Controller to create a new establishment
export const createEstablishment = async (req, res) => {
    try {
        const establishment = req.body;
        const newEstablishment = await establishmentService.createEstablishment(establishment);
        res.status(201).json(newEstablishment);
    } catch (err) {
        console.error('Error creating establishment:', err);
        res.status(500).json({ error: 'Error creating establishment' });
    }
};

// Controller to update an existing establishment
export const updateEstablishment = async (req, res) => {
    try {
        const id = req.params.id;
        const establishment = req.body;
        const updatedEstablishment = await establishmentService.updateEstablishment(id, establishment);
        if (updatedEstablishment) {
            res.json(updatedEstablishment);
        } else {
            res.status(404).json({ message: 'Establishment not found' });
        }
    } catch (err) {
        console.error(`Error updating establishment with ID ${req.params.id}:`, err);
        res.status(500).json({ error: 'Error updating establishment' });
    }
};

// Controller to delete an establishment
export const deleteEstablishment = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Log attempt to delete establishment
        console.log(`Attempting to delete establishment with ID: ${id}`);
        
        // Validate that the ID is a number
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            console.error(`Invalid establishment ID format: ${id}`);
            return res.status(400).json({ error: 'Invalid establishment ID format' });
        }
        
        // Call the service to delete the establishment
        const result = await establishmentService.deleteEstablishment(numericId);
        
        // Check the result and send appropriate response
        if (result === true) {
            console.log(`Successfully deleted establishment with ID: ${id}`);
            return res.json({ message: 'Establishment deleted successfully' });
        } else {
            console.log(`Establishment with ID ${id} not found`);
            return res.status(404).json({ error: 'Establishment not found' });
        }
    } catch (err) {
        // Log the full error for debugging
        console.error(`Error deleting establishment with ID ${req.params.id}:`, err);
        
        // Send a more specific error message based on the error type
        let errorMessage = 'Error deleting establishment';
        let statusCode = 500;
        
        // Check if the error is related to constraints
        if (err.message && (
            err.message.includes('constraint') || 
            err.message.includes('FOREIGN KEY') ||
            err.message.includes('referenced')
        )) {
            errorMessage = 'Cannot delete establishment because it is referenced by other records';
            statusCode = 409; // Conflict
        }
        
        res.status(statusCode).json({ error: errorMessage });
    }
};