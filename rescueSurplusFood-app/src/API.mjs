/**
 * API.mjs - Client-side API functions for Rescuing Surplus Food application
 * 
 * This module provides functions to communicate with the server-side API endpoints.
 * Used for retrieving establishments, bags, and food items.
 */

// Base API URL - update this with your actual server URL
const BASE_URL = 'http://localhost:3002/api';

/**
 * Fetch all establishments from the server
 * @returns {Promise<Array>} Array of establishment objects
 */
async function getAllEstablishments() {
  try {
    const response = await fetch(`${BASE_URL}/establishments`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching establishments:', error);
    throw error;
  }
}

/**
 * Fetch a single establishment by its ID from the server
 * @param {string|number} id - The ID of the establishment to fetch
 * @returns {Promise<Object>} The establishment object
 */
async function getEstablishmentById(id) {
  try {
    console.log("establishment id: " + id); 
    const response = await fetch(`${BASE_URL}/establishments/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching establishment with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all available bags from the server
 * @returns {Promise<Array>} Array of bag objects
 */
async function getAllBags() {
  try {
    const response = await fetch(`${BASE_URL}/bags`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bags:', error);
    throw error;
  }
}

/**
 * Fetch bags filtered by date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of bag objects within the date range
 */
async function getBagsByDateRange(startDate, endDate) {
  try {
    const response = await fetch(`${BASE_URL}/bags/by-date-range?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching bags by date range:', error);
    throw error;
  }
}

/**
 * Fetch food items contained in a specific bag (for regular bags)
 * @param {number} bagId - ID of the bag
 * @returns {Promise<Array>} Array of food items in the bag
 */
async function getBagContents(bagId) {
  try {
    // This function assumes you have an endpoint for retrieving bag contents
    // You might need to extract this information from the bag object directly if there's no specific endpoint
    const response = await fetch(`${BASE_URL}/bags/${bagId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const bag = await response.json();
    return bag.content || [];
  } catch (error) {
    console.error(`Error fetching contents for bag ID ${bagId}:`, error);
    throw error;
  }
}

/**
 * Fetch all food items from the server
 * @returns {Promise<Array>} Array of food item objects
 */
async function getAllFoodItems() {
  try {
    const response = await fetch(`${BASE_URL}/food-items`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }
}

/**
 * Get a specific food item by ID
 * @param {number} foodItemId - ID of the food item
 * @returns {Promise<Object>} Food item object
 */
async function getFoodItemById(foodItemId) {
  try {
    const response = await fetch(`${BASE_URL}/food-items/${foodItemId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching food item ID ${foodItemId}:`, error);
    throw error;
  }
}

/**
 * Get user's shopping cart
 * @param {number} userId - ID of the user
 * @returns {Promise<Object>} Shopping cart object
 */
async function getUserShoppingCart(userId) {
  try {
    // This assumes you have an endpoint for retrieving a specific shopping cart by user ID
    const response = await fetch(`${BASE_URL}/shopping-carts/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching shopping cart for user ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Get user's reservations
 * @param {number} userId - ID of the user
 * @returns {Promise<Array>} Array of reservation objects
 */
async function getUserReservations(userId) {
  try {
    // This assumes you have an endpoint for retrieving reservations by user ID
    const response = await fetch(`${BASE_URL}/reservations/user/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching reservations for user ID ${userId}:`, error);
    throw error;
  }
}

export {
  getAllEstablishments,
  getEstablishmentById,
  getAllBags,
  getBagsByDateRange,
  getBagContents,
  getAllFoodItems,
  getFoodItemById,
  getUserShoppingCart,
  getUserReservations
};