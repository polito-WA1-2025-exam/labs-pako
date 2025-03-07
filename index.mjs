import dayjs from 'dayjs';

function FoodItem(id, name, quantity){
    this.id = id;
    this.name = name;
    this.quantity = quantity;
}

function Bag(id, type, size, content=[], price, establishmentId, timeToPickUp, state="available", userId=null, removedItems=[]){
    this.id = id;
    this.type = type; //surprise or regular
    this.size = size;
    this.content = content;
    this.price = price;
    this.establishmentId = establishmentId;
    this.timeToPickUp = timeToPickUp;
    this.state = state;
    this.userId = userId;
    this.removedItems = removedItems;

    this.addFoodItem = function (foodItem) {
        if(this.type.toLowerCase()==="regular"){
            this.content.push(foodItem);
            console.log("Added Food Item into Bag");
            return true;
        }
        console.log("Cannot add specific food items to surprise bags");
        return false;
    }

    this.removeFoodItem = function(foodItemId) {
        if(this.type.toLowerCase() !== "regular") { 
            console.log("Cannot remove food items from surprise bags");
            return false;
        }
        
        if(this.removedItems.length >= 2) {
            console.log("Cannot remove more than 2 items from a regular bag");
            return false;
        }
        
        const index = this.content.findIndex(item => item.id === foodItemId);
        if(index !== -1) {
            const removedItem = this.content.splice(index, 1)[0];
            this.removedItems.push(removedItem);
            console.log(`Removed ${removedItem.name} from the bag`);
            return true;
        }
        
        console.log("Food item not found in the bag");
        return false;
    }

    this.reserve = function(userId) {
        if(this.state === "available") {
            this.state = "reserved";
            this.userId = userId;
            console.log(`Bag ${this.id} reserved by user ${userId}`);
            return true;
        }
        console.log(`Bag ${this.id} is not available for reservation`);
        return false;
    }

    this.release = function() {
        if(this.state === "reserved") {
            this.state = "available";
            this.userId = null;
            console.log(`Bag ${this.id} released and now available`);
            return true;
        }
        console.log(`Bag ${this.id} is not reserved`);
        return false;
    }

    this.display = () => {
        console.log(`Type: ${this.type}`);
        console.log(`Size: ${this.size}`);
        console.log(`Price: ${this.price}`);
        console.log(`Establishment ID: ${this.establishmentId}`);
        console.log(`Time to pick up: ${this.timeToPickUp}`);
        console.log(`State: ${this.state}`);
        if(this.type.toLowerCase() === "regular") {
            console.log(`Contents:`);
            this.content.forEach(item => console.log(`  - ${item.quantity}x ${item.name}`));
        }
        console.log('--------------------------');
    }
    
}

function Establishment(id, name, address, phoneNumber, category, type){
    this.id = id;
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.category = category; // type of cuisine for restaurant, food category for store
    this.type = type; // restaurant or store
    this.bags = [];

    this.addBag = function(bag) {
        this.bags.push(bag);
        console.log(`Bag ${bag.id} added to establishment ${this.name}`);
        return true;
    }

    this.removeBag = function(bagId) {
        const index = this.bags.findIndex(bag => bag.id === bagId);
        if(index !== -1) {
            this.bags.splice(index, 1);
            console.log(`Bag ${bagId} removed from establishment ${this.name}`);
            return true;
        }
        console.log(`Bag ${bagId} not found in establishment ${this.name}`);
        return false;
    }

    this.getAvailableBags = function() {
        return this.bags.filter(bag => bag.state === "available");
    }

    this.getReservedBags = function() {
        return this.bags.filter(bag => bag.state === "reserved");
    }

    this.display = () => {
        console.log(`Name: ${this.name}`);
        console.log(`Address: ${this.address}`);
        console.log(`Phone Number: ${this.phoneNumber}`);
        console.log(`Category: ${this.category}`);
        console.log(`Type: ${this.type}`);
        console.log(`Available Bags: ${this.getAvailableBags().length}`);
        console.log(`Reserved Bags: ${this.getReservedBags().length}`);
        console.log('--------------------------');
    }
}

function ShoppingCart(id, userId = null, reservations = [], allergies = [], requests = []) {
    this.id = id;
    this.userId = userId;
    this.reservations = reservations;
    this.allergies = allergies;
    this.requests = requests;

    // Adds a reservation to the cart, ensuring only one per establishment per day
    this.addReservation = (reservation) => {
        const today = dayjs().format('YYYY-MM-DD');
        const alreadyInCart = this.reservations.some(r => 
            r.bags.some(b => b.establishmentId === reservation.bags[0].establishmentId) &&
            dayjs(r.timestamp).format('YYYY-MM-DD') === today
        );
        
        if (alreadyInCart) {
            console.log("You can only add one reservation per establishment per day.");
            return false;
        }
        console.log("Reservation added to the cart.");
        this.reservations.push(reservation);
        return true;
    };

    // Removes a reservation from the cart
    this.removeReservation = (reservationId) => {
        const index = this.reservations.findIndex(reservation => reservation.id === reservationId);
        if (index !== -1) {
            this.reservations.splice(index, 1);
            console.log("Reservation removed from the cart.");
            return true;
        }
        console.log("Reservation not found in the cart.");
        return false;
    };

    // Adds an allergy to the list
    this.addAllergy = (allergy) => {
        this.allergies.push(allergy);
        console.log(`Allergy '${allergy}' added to the cart`);
        return true;
    };

    // Adds a special request
    this.addRequest = (request) => {
        this.requests.push(request);
        console.log(`Request '${request}' added to the cart`);
        return true;
    };

    // Calculates the total price of all reservations in the cart
    this.totalPrice = () => 
        this.reservations.reduce((total, reservation) => 
            total + reservation.bags.reduce((sum, bag) => sum + bag.price, 0), 0
        );

    // Confirms the order by updating the state of all reservations to "reserved"
    this.confirmOrder = function () {
        if (this.reservations.some(reservation => reservation.bags.some(bag => bag.state !== "available"))) {
            console.log("Some bags are unavailable. Order canceled.");
            return false;
        }
        this.reservations.forEach(reservation => {
            reservation.bags.forEach(bag => bag.reserve(this.userId));
            reservation.status = "active";
        });
        console.log("Order confirmed.");
        return true;
    };

    // Removes a food item from a regular bag in a reservation
    this.removeFoodItemFromRegularBag = (reservationId, bagId, foodItemId) => {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) {
            console.log("Reservation not found.");
            return false;
        }
    
        const bag = reservation.bags.find(b => b.id === bagId);
        if (!bag || bag.type !== "regular") {
            console.log("Bag not found or not a regular bag.");
            return false;
        }
    
        return bag.removeFoodItem(foodItemId);
    };
    
    // Displays details of a regular bag in a reservation
    this.viewDetailsOfRegularBag = (reservationId, bagId) => {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) {
            console.log("Reservation not found.");
            return null;
        }
    
        const bag = reservation.bags.find(b => b.id === bagId);
        if (bag && bag.type === "regular") {
            bag.display();
            return bag;
        } else {
            console.log("Bag not found or not a regular bag.");
            return null;
        }
    };

    this.display = function () {
        console.log(`\nShopping Cart ID: ${this.id}`);
        console.log(`User ID: ${this.userId}`);
        console.log(`Allergies: ${this.allergies.join(', ') || 'None'}`);
        console.log(`Special Requests: ${this.requests.join(', ') || 'None'}`);
        console.log(`Total Price: $${this.totalPrice().toFixed(2)}`);
        console.log(`Reservations:`);
        this.reservations.forEach(reservation => reservation.display());
    };
}

function User(id, name, email, password){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.shoppingCart = new ShoppingCart(id, id);
    this.reservations = [];

    this.addReservation = function(reservation) {
        this.reservations.push(reservation);
        console.log(`Reservation ${reservation.id} added to user ${this.name}`);
        return true;
    }

    this.removeReservation = function(reservationId) {
        const index = this.reservations.findIndex(r => r.id === reservationId);
        if(index !== -1) {
            const reservation = this.reservations.splice(index, 1)[0];
            reservation.cancelReservation();
            console.log(`Reservation ${reservationId} removed from user ${this.name}`);
            return true;
        }
        console.log(`Reservation ${reservationId} not found for user ${this.name}`);
        return false;
    }

    this.display = function() {
        console.log(`User ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Reservations: ${this.reservations.length}`);
        console.log('--------------------------');
    }
}

function Reservation(id, userId=null, bags=[], timestamp, status="active"){
    this.id = id;
    this.userId = userId;
    this.bags = bags;
    this.timestamp = timestamp;
    this.status = status;

    // Adds a bag to the reservation if it meets all constraints
    this.addBag = (bag) => {
        let now = dayjs(); // Current time
        let pickUpTime = dayjs(bag.timeToPickUp); // Bag's pick-up time

        // Check if the bag is already in the reservation
        if (this.bags.some(b => b.id === bag.id)) {
            console.log("Bag is already in the reservation.");
            return false;
        }

        // Ensure pick-up time is in the future
        if (pickUpTime.isAfter(now) && bag.state === "available") {
            this.bags.push(bag);
            console.log("Bag added to the reservation.");
            return true;
        }

        console.log("Bag cannot be added: either pick-up time is not in the future or bag is not available.");
        return false;
    };

    this.removeBag = (bagId) => {
        const index = this.bags.findIndex(bag => bag.id === bagId);
        if (index !== -1) {
            this.bags.splice(index, 1);
            console.log("Bag removed from the reservation.");
            return true;
        }
        console.log("Bag not found in the reservation.");
        return false;
    };

    this.cancelReservation = function () {
        this.bags.forEach(bag => bag.release());
        this.status = "canceled";
        console.log("Reservation canceled.");
        return true;
    };   

    this.display = function() {
        console.log(`Reservation ID: ${this.id}`);
        console.log(`User ID: ${this.userId}`);
        console.log(`Timestamp: ${this.timestamp}`);
        console.log(`Status: ${this.status}`);
        console.log(`Bags:`);
        this.bags.forEach(bag => bag.display());
    }
}

// Container objects for collections
function FoodItemCollection() {
    this.items = [];

    this.add = function(foodItem) {
        this.items.push(foodItem);
        return foodItem;
    }

    this.getById = function(id) {
        return this.items.find(item => item.id === id);
    }

    this.getAll = function() {
        return [...this.items];
    }

    this.remove = function(id) {
        const index = this.items.findIndex(item => item.id === id);
        if(index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }
}

function BagCollection() {
    this.bags = [];

    this.add = function(bag) {
        this.bags.push(bag);
        return bag;
    }

    this.getById = function(id) {
        return this.bags.find(bag => bag.id === id);
    }

    this.getAll = function() {
        return [...this.bags];
    }

    this.getAvailable = function() {
        return this.bags.filter(bag => bag.state === "available");
    }

    this.getReserved = function() {
        return this.bags.filter(bag => bag.state === "reserved");
    }

    this.getByEstablishment = function(establishmentId) {
        return this.bags.filter(bag => bag.establishmentId === establishmentId);
    }

    this.getByType = function(type) {
        return this.bags.filter(bag => bag.type === type);
    }

    this.getBySize = function(size) {
        return this.bags.filter(bag => bag.size === size);
    }

    this.remove = function(id) {
        const index = this.bags.findIndex(bag => bag.id === id);
        if(index !== -1) {
            return this.bags.splice(index, 1)[0];
        }
        return null;
    }
}

function EstablishmentCollection() {
    this.establishments = [];

    this.add = function(establishment) {
        this.establishments.push(establishment);
        return establishment;
    }

    this.getById = function(id) {
        return this.establishments.find(est => est.id === id);
    }

    this.getAll = function() {
        return [...this.establishments];
    }

    this.getSortedByName = function() {
        return [...this.establishments].sort((a, b) => a.name.localeCompare(b.name));
    }

    this.getByType = function(type) {
        return this.establishments.filter(est => est.type === type);
    }

    this.getByCategory = function(category) {
        return this.establishments.filter(est => est.category === category);
    }

    this.remove = function(id) {
        const index = this.establishments.findIndex(est => est.id === id);
        if(index !== -1) {
            return this.establishments.splice(index, 1)[0];
        }
        return null;
    }
}

function UserCollection() {
    this.users = [];

    this.add = function(user) {
        this.users.push(user);
        return user;
    }

    this.getById = function(id) {
        return this.users.find(user => user.id === id);
    }

    this.getByEmail = function(email) {
        return this.users.find(user => user.email === email);
    }

    this.getAll = function() {
        return [...this.users];
    }

    this.remove = function(id) {
        const index = this.users.findIndex(user => user.id === id);
        if(index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        return null;
    }
}

function ReservationCollection() {
    this.reservations = [];

    this.add = function(reservation) {
        this.reservations.push(reservation);
        return reservation;
    }

    this.getById = function(id) {
        return this.reservations.find(res => res.id === id);
    }

    this.getByUserId = function(userId) {
        return this.reservations.filter(res => res.userId === userId);
    }

    this.getActive = function() {
        return this.reservations.filter(res => res.status === "active");
    }

    this.getCanceled = function() {
        return this.reservations.filter(res => res.status === "canceled");
    }

    this.getAll = function() {
        return [...this.reservations];
    }

    this.remove = function(id) {
        const index = this.reservations.findIndex(res => res.id === id);
        if(index !== -1) {
            return this.reservations.splice(index, 1)[0];
        }
        return null;
    }
}

// Create global collections
const foodItems = new FoodItemCollection();
const bags = new BagCollection();
const establishments = new EstablishmentCollection();
const users = new UserCollection();
const reservations = new ReservationCollection();

function createObjects(){
    // Create users
    const user1 = users.add(new User("user123", "John Doe", "john@example.com", "password123"));
    const user2 = users.add(new User("user456", "Jane Smith", "jane@example.com", "password456"));
    
    // Creation of 3 restaurants/stores
    const establishment1 = establishments.add(new Establishment(1, "Ristorante Bella Italia", "Via Roma 10, Milano", "0234567890", "Italian", "restaurant"));
    const establishment2 = establishments.add(new Establishment(2, "Sushi Master", "Piazza Venezia 5, Roma", "0645678901", "Japanese", "restaurant"));
    const establishment3 = establishments.add(new Establishment(3, "Supermarket Fresh", "Corso Torino 15, Napoli", "0816789012", "Grocery", "store"));
    const establishment4 = establishments.add(new Establishment(4, "Bakery Delight", "Via Garibaldi 8, Firenze", "0551234567", "Bakery", "store"));
    const establishment5 = establishments.add(new Establishment(5, "Trattoria del Gusto", "Corso Vittorio Emanuele 20, Palermo", "0912345678", "Italian", "restaurant"));

    // Creation of some food items
    const food1 = foodItems.add(new FoodItem(1, "Pizza Margherita", 1));
    const food2 = foodItems.add(new FoodItem(2, "Pasta alla Carbonara", 1));
    const food3 = foodItems.add(new FoodItem(3, "Sushi Misto", 8));
    const food4 = foodItems.add(new FoodItem(4, "Banana", 3));
    const food5 = foodItems.add(new FoodItem(5, "Mela Rossa", 2));
    const food6 = foodItems.add(new FoodItem(6, "Croissant", 2));
    const food7 = foodItems.add(new FoodItem(7, "Pane", 1));
    const food8 = foodItems.add(new FoodItem(8, "Arancini", 3));

    // Creation of some bags (surprise and regular)
    const surpriseBag1 = bags.add(new Bag(101, "surprise", "medium", [], 5.99, 1, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag1 = bags.add(new Bag(102, "regular", "small", [food1, food2], 6.99, 1, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));

    const surpriseBag2 = bags.add(new Bag(103, "surprise", "large", [], 7.99, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag2 = bags.add(new Bag(104, "regular", "medium", [food3, food4], 8.49, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));

    const surpriseBag3 = bags.add(new Bag(105, "surprise", "small", [], 4.49, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag3 = bags.add(new Bag(106, "regular", "large", [food4, food5], 5.99, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm')));
    
    const regularBag4 = bags.add(new Bag(107, "regular", "medium", [food6, food7], 4.99, 4, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));
    const surpriseBag4 = bags.add(new Bag(108, "surprise", "small", [], 3.99, 5, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm')));
    const regularBag5 = bags.add(new Bag(109, "regular", "large", [food8], 6.49, 5, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm')));

    // Adding bags to establishments
    establishment1.addBag(surpriseBag1);
    establishment1.addBag(regularBag1);
    establishment2.addBag(surpriseBag2);
    establishment2.addBag(regularBag2);
    establishment3.addBag(surpriseBag3);
    establishment3.addBag(regularBag3);
    establishment4.addBag(regularBag4);
    establishment5.addBag(surpriseBag4);
    establishment5.addBag(regularBag5);

    // Creation of reservations
    const reservation1 = reservations.add(new Reservation(201, "user123", [surpriseBag1], dayjs().format('YYYY-MM-DD HH:mm')));
    const reservation2 = reservations.add(new Reservation(202, "user456", [regularBag2], dayjs().format('YYYY-MM-DD HH:mm')));
    
    // Add reservations to users
    user1.addReservation(reservation1);
    user2.addReservation(reservation2);

    // Add to shopping carts
    user1.shoppingCart.addReservation(reservation1);
    user2.shoppingCart.addReservation(reservation2);
    
    // Add allergies and requests
    user1.shoppingCart.addAllergy("Gluten");
    user1.shoppingCart.addRequest("Please keep items separate");
    
    // Display all data
    displayAllData();
}

function displayAllData() {
    console.log("\n===== FOOD RESCUE APPLICATION DATA =====\n");
    
    console.log("----- USERS -----");
    users.getAll().forEach(user => user.display());
    
    console.log("\n----- ESTABLISHMENTS (Sorted by Name) -----");
    establishments.getSortedByName().forEach(est => est.display());
    
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

function main(){
    createObjects();
    
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

main();