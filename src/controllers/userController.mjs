// Import the user service that interacts with the database
import userService from '../queries/userQueries.mjs';

// Controller to fetch all users
export const fetchAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userService.getAllUsers();
        // Return users as JSON response
        res.json(users);
    } catch (err) {
        // Return an error response if an issue occurs while retrieving users
        res.status(500).json({ error: 'Error retrieving users' });
    }
};