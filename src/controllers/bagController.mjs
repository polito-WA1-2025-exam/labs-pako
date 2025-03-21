// Import query functions to interact with the database
import bagService from '../queries/bagQueries.mjs';

// Controller to fetch all bags
export const fetchAllBags = async (req, res) => {  
    try {
        // Get all bags from the database using the query function
        const bags = await bagService.getAllBags();
        // Return the found bags as a JSON response
        res.json(bags);
    } catch (err) {
        // If there's an error during the query, return a 500 status with an error message
        res.status(500).json({ error: 'Database error' });
    }
};

// Controller to fetch bags based on a date range
export const fetchBagsByDateRange = async (req, res) => {
    // Destructure the start and end dates from the query
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end dates are required' });
    }

    try {
        // Get bags based on the date range using the query function
        const bags = await bagService.getBagsByDateRange(startDate, endDate);
        // Return the found bags as a JSON response
        res.json(bags);
    } catch (err) {
        // If there's an error during the query, return a 500 status with an error message
        res.status(500).json({ error: 'Database error' });
    }
};

// Add more functions for other operations (create, update, delete, etc.)
