// Import query functions to interact with the database
import bagService from '../queries/bagQueries.mjs';
import dayjs from 'dayjs';

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

// Controller to create a new bag
export const createBag = async (req, res) => {
    try {
        const bagData = req.body;
        
        // Basic validation
        if (!bagData.type || !bagData.size || !bagData.price || !bagData.establishmentId || !bagData.timeToPickUp) {
            return res.status(400).json({ 
                error: 'Missing required fields: type, size, price, establishmentId, timeToPickUp' 
            });
        }
        
        // Validate bag type
        if (!['regular', 'surprise'].includes(bagData.type)) {
            return res.status(400).json({ 
                error: 'Invalid bag type. Must be "regular" or "surprise"' 
            });
        }
        
        // Validate size
        if (![0, 1, 2].includes(bagData.size)) {
            return res.status(400).json({ 
                error: 'Invalid size. Must be 0 (small), 1 (medium), or 2 (large)' 
            });
        }
        
        // Validate price
        if (isNaN(bagData.price) || parseFloat(bagData.price) <= 0) {
            return res.status(400).json({ 
                error: 'Price must be a positive number' 
            });
        }
        
        // Validate pick-up time is in the future
        const pickupTime = dayjs(bagData.timeToPickUp);
        if (!pickupTime.isValid() || pickupTime.isBefore(dayjs())) {
            return res.status(400).json({ 
                error: 'Pick-up time must be a valid future date and time' 
            });
        }
        
        // Validate content for regular bags
        if (bagData.type === 'regular') {
            if (!bagData.content || !Array.isArray(bagData.content) || bagData.content.length === 0) {
                return res.status(400).json({ 
                    error: 'Regular bags must have at least one food item in content' 
                });
            }
            
            // Validate each content item
            for (const item of bagData.content) {
                if (!item.FoodItemID || !item.Quantity || parseInt(item.Quantity) < 1) {
                    return res.status(400).json({ 
                        error: 'Each content item must have valid FoodItemID and Quantity (at least 1)' 
                    });
                }
            }
        }
        
        // Generate ID if not provided
        if (!bagData.id) {
            bagData.id = dayjs().valueOf();
        }
        
        // Create the bag using the query function
        const newBag = await bagService.createBag(bagData);
        
        // Return the created bag
        res.status(201).json(newBag);
    } catch (err) {
        console.error('Error creating bag:', err);
        res.status(500).json({ error: 'Internal server error while creating bag' });
    }
};

// Add more functions for other operations (create, update, delete, etc.)
