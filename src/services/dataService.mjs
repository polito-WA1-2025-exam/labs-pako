import dayjs from 'dayjs';
import FoodItem from '../models/FoodItem.mjs';
import FoodItemCollection from '../models/FoodItemCollection.mjs';
import Bag from '../models/Bag.mjs';
import BagCollection from '../models/BagCollection.mjs';
import Establishment from '../models/Establishment.mjs';
import EstablishmentCollection from '../models/EstablishmentCollection.mjs';
import Reservation from '../models/Reservation.mjs';
import ReservationCollection from '../models/ReservationCollection.mjs';
import ShoppingCart from '../models/ShoppingCart.mjs';
import ShoppingCartCollection from '../models/ShoppingCartCollection.mjs';
import User from '../models/User.mjs';
import UserCollection from '../models/UserCollection.mjs';
import foodItemQueries from '../queries/foodItemQueries.mjs'; //Getting the functions all-in-one from each file 
import establishmentQueries from '../queries/establishmentQueries.mjs';
import userQueries from '../queries/userQueries.mjs';
import bagQueries from '../queries/bagQueries.mjs';
import reservationQueries from '../queries/reservationQueries.mjs';
import shoppingCartQueries from '../queries/shoppingCartQueries.mjs';
import dbConnection from '../db/dbConnection.mjs';
export function createObjects() {
    // Create global collections
    const foodItems = new FoodItemCollection();
    const bags = new BagCollection();
    const establishments = new EstablishmentCollection();
    const users = new UserCollection();
    const reservations = new ReservationCollection();

    // Create users
    const user1 = users.add(new User("user123", "John Doe", "john@example.com", "password123"));
    const user2 = users.add(new User("user456", "Jane Smith", "jane@example.com", "password456"));

    // Create establishments
    const establishment1 = establishments.add(new Establishment(1, "Ristorante Bella Italia", "Via Roma 10, Milano", "0234567890", "Italian", "restaurant"));
    const establishment2 = establishments.add(new Establishment(2, "Sushi Master", "Piazza Venezia 5, Roma", "0645678901", "Japanese", "restaurant"));
    const establishment3 = establishments.add(new Establishment(3, "Supermarket Fresh", "Corso Torino 15, Napoli", "0816789012", "Grocery", "store"));
    const establishment4 = establishments.add(new Establishment(4, "Bakery Delight", "Via Garibaldi 8, Firenze", "0551234567", "Bakery", "store"));
    const establishment5 = establishments.add(new Establishment(5, "Trattoria del Gusto", "Corso Vittorio Emanuele 20, Palermo", "0912345678", "Italian", "restaurant"));

    // Create foods
    const food1 = foodItems.add(new FoodItem(1, "Pizza Margherita", 1));
    const food2 = foodItems.add(new FoodItem(2, "Pasta alla Carbonara", 1));
    const food3 = foodItems.add(new FoodItem(3, "Sushi Misto", 8));
    const food4 = foodItems.add(new FoodItem(4, "Banana", 3));
    const food5 = foodItems.add(new FoodItem(5, "Mela Rossa", 2));
    const food6 = foodItems.add(new FoodItem(6, "Croissant", 2));
    const food7 = foodItems.add(new FoodItem(7, "Pane", 1));
    const food8 = foodItems.add(new FoodItem(8, "Arancini", 3));

    // Create bags
    const surpriseBag1 = bags.add(new Bag(101, "surprise", "medium", [], 5.99, 1, 1)); //Only have to put days 
    const regularBag1 = bags.add(new Bag(102, "regular", "small", [food1, food2], 6.99, 1, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));
    
    const surpriseBag2 = bags.add(new Bag(103, "surprise", "large", [], 7.99, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag2 = bags.add(new Bag(104, "regular", "medium", [food3, food4], 8.49, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));

    const surpriseBag3 = bags.add(new Bag(105, "surprise", "small", [], 4.49, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag3 = bags.add(new Bag(106, "regular", "large", [food4, food5], 5.99, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm')));
    
    const regularBag4 = bags.add(new Bag(107, "regular", "medium", [food6, food7], 4.99, 4, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));
    const surpriseBag4 = bags.add(new Bag(108, "surprise", "small", [], 3.99, 5, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag5 = bags.add(new Bag(109, "regular", "large", [food8], 6.49, 5, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));

    // Assign bags to establishments
    establishment1.addBag(surpriseBag1);
    establishment1.addBag(regularBag1);
    establishment2.addBag(surpriseBag2);
    establishment2.addBag(regularBag2);
    establishment3.addBag(surpriseBag3);
    establishment3.addBag(regularBag3);
    establishment4.addBag(regularBag4);
    establishment5.addBag(surpriseBag4);
    establishment5.addBag(regularBag5);

    // Create reservation
    const reservation1 = reservations.add(new Reservation(201, "user123", [surpriseBag1], dayjs().format('YYYY-MM-DD HH:mm')));
    const reservation2 = reservations.add(new Reservation(202, "user456", [regularBag2], dayjs().format('YYYY-MM-DD HH:mm')));
    
    // Add reservations to users
    user1.addReservation(reservation1);
    user2.addReservation(reservation2);

    // Add reservations to shopping cart
    user1.shoppingCart.addReservation(reservation1);
    user2.shoppingCart.addReservation(reservation2);
    
    // Add allergie and requests
    user1.shoppingCart.addAllergy("Gluten");
    user1.shoppingCart.addRequest("Please keep items separate");

    displayAllData(users, establishments, foodItems, bags, reservations);
    
    return { users, establishments, foodItems, bags, reservations };
}

export function displayAllData(users, establishments, foodItems, bags, reservations) {
    console.log("\n===== FOOD RESCUE APPLICATION DATA =====\n");
    
    console.log("----- USERS -----");
    users.getAll().forEach(user => user.display());
    
    console.log("\n----- ESTABLISHMENTS (Sorted by Name) -----");
    establishments.getSortedByName().forEach(est => est.display());

    console.log("\n----- FOOD ITEMS -----");    
    foodItems.getAll().forEach(item => item.display());
    
    console.log("\n----- BAGS SORTED BY DATE -----")
    bags.sortByDate();

    console.log("\n----- AVAILABLE BAGS -----");
    bags.getAvailable().forEach(bag => bag.display());
    
    console.log("\n----- RESERVED BAGS -----");
    bags.getReserved().forEach(bag => bag.display());
    
    console.log("\n----- ACTIVE RESERVATIONS -----");
    reservations.getActive().forEach(res => res.display());
    
    console.log("\n----- SHOPPING CARTS -----");
    users.getAll().forEach(user => user.shoppingCart.display());
    
    console.log("\n===== END OF DATA =====");
}

// Function to run the example in Lab1
export function runExample() {
    // Call createObjects to generate the collections
    const { foodItems, bags, establishments, users, reservations } = createObjects();   
    
    // Example of using the collections
    console.log("\n===== EXAMPLES OF USING COLLECTIONS =====\n");
    
    // Get all restaurants
    console.log("----- ALL RESTAURANTS -----");
    const allRestaurants = establishments.getByType("restaurant");
    allRestaurants.forEach(rest => console.log(rest.name));

    // Get all surprise bags
    console.log("\n----- ALL SURPRISE BAGS -----");
    const surpriseBags = bags.getByType("surprise");
    console.log(`Total surprise bags: ${surpriseBags.length}`);
    
    // Get all medium-sized bags
    console.log("\n----- ALL MEDIUM BAGS -----");
    const mediumBags = bags.getBySize("medium");
    console.log(`Total medium bags: ${mediumBags.length}`);
    
    // Get all bags from a specific establishment
    console.log("\n----- BAGS FROM ESTABLISHMENT 1 -----");
    const bagsFromEst1 = bags.getByEstablishment(1);
    console.log(`Total bags from Establishment 1: ${bagsFromEst1.length}`);
    
    // Example of removing a food item from a regular bag
    console.log("\n----- REMOVING FOOD ITEM FROM BAG -----");
    const user = users.getById("user123");
    const reservation = reservations.getByUserId("user123")[0];
    
    // Add a regular bag to the reservation for testing
    const regularBag = bags.getById(102);
    reservation.addBag(regularBag);
    
    // Remove a food item
    user.shoppingCart.removeFoodItemFromRegularBag(reservation.id, regularBag.id, 1);
    
    // View the updated bag
    console.log("\n----- UPDATED BAG AFTER REMOVING ITEM -----");
    user.shoppingCart.viewDetailsOfRegularBag(reservation.id, regularBag.id);
}

// Function to retrieve all data for Lab2
export async function retrieveAllData() {
    // Create global collections
    const foodItems = new FoodItemCollection();
    const bags = new BagCollection();
    const establishments = new EstablishmentCollection();
    const users = new UserCollection();
    const reservations = new ReservationCollection();
    const shoppingCarts = new ShoppingCartCollection();

    // Fetch data from the database
    const fetchedFoodItems = await foodItemQueries.getAllFoodItems();
    const fetchedEstablishments = await establishmentQueries.getAllEstablishments();
    const fetchedUsers = await userQueries.getAllUsers();
    const fetchedBags = await bagQueries.getAllBags();
    const fetchedReservations = await reservationQueries.getAllReservations();
    const fetchedShoppingCarts = await shoppingCartQueries.getAllShoppingCarts();

    // Populate collections with fetched data
    fetchedFoodItems.forEach(item => foodItems.add(new FoodItem(item.id, item.name, item.quantity, item.creationDate)));
    fetchedEstablishments.forEach(est => establishments.add(new Establishment(est.id, est.name, est.address, est.phoneNumber, est.category, est.type, est.bags, est.content, est.creationDate)));
    fetchedUsers.forEach(user => users.add(new User(user.id, user.name, user.email, user.creationDate, user.password)));
    fetchedBags.forEach(bag => bags.add(new Bag(bag.id, bag.type, bag.size, bag.content, bag.price, bag.establishmentId, bag.daysToPickUp, bag.state, bag.userId, bag.removedItems, bag.creationDate)));
    fetchedReservations.forEach(res => reservations.add(new Reservation(res.id, res.timestamp, res.status, res.bags, res.userId, res.creationDate)));
    fetchedShoppingCarts.forEach(cart => shoppingCarts.add(new ShoppingCart(cart.id, cart.userId, cart.reservations, cart.allergies, cart.requests)));

    // Display the data
    console.log("\n----- FOOD ITEMS -----");
    foodItems.getAll().forEach(item => item.display());
    
    console.log("\n----- ESTABLISHMENTS -----");
    establishments.getSortedByName().forEach(est => est.display())
    
    console.log("\n----- USERS -----");
    users.getAll().forEach(user => user.display());

    console.log("\n----- BAGS -----");
    bags.getAll().forEach(bag => bag.display());

    console.log("\n----- RESERVATIONS -----");
    reservations.getAll().forEach(res => res.display());

    console.log("\n----- SHOPPING CARTS -----");
    shoppingCarts.getAll().forEach(cart => cart.display());

    await dbConnection.closeConnection();  // Close the DB connection efficiently
}

// Now its time for testing each newly added function
export async function testDatabaseOperations() {
    console.log("\n===== TESTING DATABASE OPERATIONS FOR LAB 2 =====\n");
    
    const foodItemQueries = await import('../queries/foodItemQueries.mjs');
    const bagQueries = await import('../queries/bagQueries.mjs');
    
    try {
        // 1. Test retrieving all food items
        console.log("----- RETRIEVING ALL FOOD ITEMS -----");
        const allFoodItems = await foodItemQueries.default.getAllFoodItems();
        console.log(`Retrieved ${allFoodItems.length} food items`);
        // allFoodItems.forEach(item => console.log(`- ${item.name} (ID: ${item.id}, Quantity: ${item.quantity})`));
        allFoodItems.forEach(item => item.display());

        // 2. Test searching for food items by name
        console.log("\n----- SEARCHING FOR FOOD ITEMS BY NAME -----");
        const searchTerm = "App"; // Search for items containing "App" (like "Apple")
        const searchResults = await foodItemQueries.default.searchFoodItemsByName(searchTerm);
        console.log(`Found ${searchResults.length} food items containing "${searchTerm}"`);
        //searchResults.forEach(item => console.log(`- ${item.name} (ID: ${item.id}, Quantity: ${item.quantity})`));
        searchResults.forEach(item => item.display());

        // 3. Test retrieving bags by date range
        console.log("\n----- RETRIEVING BAGS BY DATE RANGE -----");
        const startDate = "2023-01-01";
        const endDate = "2023-12-31";
        const bagsInRange = await bagQueries.default.getBagsByDateRange(startDate, endDate);
        console.log(`Found ${bagsInRange.length} bags between ${startDate} and ${endDate}`);
        //bagsInRange.forEach(bag => console.log(`- Bag ID: ${bag.id}, Type: ${bag.type}, Price: ${bag.price}`));
        bagsInRange.forEach(bag => bag.display());

        // 4. Test creating a new food item
        console.log("\n----- CREATING A NEW FOOD ITEM -----");
        const newFoodItem = await foodItemQueries.default.createFoodItem("Pineapple", 10);
        //console.log(`Created new food item: ${newFoodItem.name} (ID: ${newFoodItem.id}, Quantity: ${newFoodItem.quantity})`);
        newFoodItem.display();

        // 5. Test updating a food item
        console.log("\n----- UPDATING A FOOD ITEM -----");
        const updateResult = await foodItemQueries.default.updateFoodItem(newFoodItem.id, { quantity: 15 });
        console.log(updateResult.message);
        
        // 6. Test updating multiple food items
        console.log("\n----- UPDATING MULTIPLE FOOD ITEMS -----");
        const multiUpdateResult = await foodItemQueries.default.updateMultipleFoodItemsQuantity(5, { 
            field: 'Quantity', 
            operator: '<', 
            value: 20 
        });
        console.log(multiUpdateResult.message);

        // 7. Test retrieving all food items again to see the changes
        console.log("\n----- RETRIEVING ALL FOOD ITEMS AFTER UPDATES -----");
        const updatedFoodItems = await foodItemQueries.default.getAllFoodItems();
        console.log(`Retrieved ${updatedFoodItems.length} food items`);
        //updatedFoodItems.forEach(item => console.log(`- ${item.name} (ID: ${item.id}, Quantity: ${item.quantity})`));
        updatedFoodItems.forEach(item => item.display());

        // 8. Test deleting the food item we created
        console.log("\n----- DELETING A FOOD ITEM -----");
        const deleteResult = await foodItemQueries.default.deleteFoodItemById(newFoodItem.id);
        console.log(deleteResult.message);
        
    } catch (error) {
        console.error("Error during database operations test:", error);
    }
    await dbConnection.closeConnection();
}

