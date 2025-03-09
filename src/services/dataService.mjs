import dayjs from 'dayjs';
import FoodItem from '../models/FoodItem.mjs';
import FoodItemCollection from '../models/FoodItemCollection.mjs';
import Bag from '../models/Bag.mjs';
import BagCollection from '../models/BagCollection.mjs';
import Establishment from '../models/Establishment.mjs';
import EstablishmentCollection from '../models/EstablishmentCollection.mjs';
import Reservation from '../models/Reservation.mjs';
import ReservationCollection from '../models/ReservationCollection.mjs';
import User from '../models/User.mjs';
import UserCollection from '../models/UserCollection.mjs';


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

