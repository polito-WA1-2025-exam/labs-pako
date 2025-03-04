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

    this.addFoddItem = function (foodItem) {
        if(this.type.toLowerCase()==="surprise"){
            this.content.push(foodItem);
        }
        console.log("Added Food Item into Bag");
    }

    this.display = () => {
        console.log(`Type: ${this.type}`);
        console.log(`Food Items: ${this.content}`);
        console.log(`Price: ${this.price}`);
        console.log(`Size: ${this.size}`);
        console.log(`Establishment ID: ${this.establishmentId}`);
        console.log(`Time to pick up: ${this.timeToPickUp}`);
        console.log(`Contents:`);
        this.content.forEach(item => console.log(`  - ${item.quantity}x ${item.name}`));
        console.log('--------------------------');
    }
    
}

function Establishment(id, name, address, phoneNumber, category, type, bags=[]){
    this.id = id;
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.category = category; //type of cousine for restaurant, food category for store
    this.type = type; //restaurant or store
    this.bags = bags;

    this.addBag = function(bag) {
        if (!this.bags.some(b => b.establishmentId === bag.establishmentId)) {
            this.bags.push(bag);
            console.log("Bag added into establishment.");
            return true;
        }
        console.log("There is already a bag from this establishment.");
        return false; //There is already a bag from this establishment
    }

    this.display = () => {
        console.log(`Name: ${this.name}`);
        console.log(`Address: ${this.address}`);
        console.log(`Phone Number: ${this.phoneNumber}`);
        console.log(`Category: ${this.category}`);
        console.log(`Type: ${this.type}`);
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
    this.addAllergy = (allergy) => this.allergies.push(allergy);

    // Adds a special request
    this.addRequest = (request) => this.requests.push(request);

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
        this.reservations.forEach(reservation => reservation.bags.forEach(bag => bag.state = "reserved"));
        console.log("Order confirmed.");
        //TODO: update inventory
        return true;
    };

    // Removes a food item from a regular bag in a reservation
    this.removeFoodItemFromRegularBag = (reservationId, bagId, foodItem) => {
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
    
        if (!bag.removedItems) {
            bag.removedItems = [];
        }
    
        if (bag.removedItems.length >= 2) {
            console.log("You can only remove up to two items.");
            return false;
        }
    
        const itemIndex = bag.content.findIndex(item => item.id === foodItem.id);
        if (itemIndex !== -1) {
            bag.removedItems.push(bag.content.splice(itemIndex, 1)[0]);
            console.log(`${foodItem.name} removed from the bag.`);
            return true;
        }
    
        console.log("Item not found in the bag.");
        return false;
    };
    
    // Displays details of a regular bag in a reservation
    this.viewDetailsOfRegularBag = (reservationId, bagId) => {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation) {
            console.log("Reservation not found.");
            return;
        }
    
        const bag = reservation.bags.find(b => b.id === bagId);
        if (bag && bag.type === "regular") {
            bag.display();
        } else {
            console.log("Bag not found or not a regular bag.");
        }
    };

    this.display = function () {
        console.log(`\nShopping Cart ID: ${this.id}`);
        console.log(`User ID: ${this.userId}`);
        console.log(`Reservations:`);
        this.reservations.forEach(reservation => reservation.display());
    };

}

// TODO : add user object?
/*
function User(id, name, email, password, shoppingCartId=null, reservations=[]){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.shoppingCartId = shoppingCartId; //TODO: check this strcutre, maybe you add this.shoppingCart = new ShoppingCart(id); ??
    this.reservations = reservations;

    this.addReservation = (reservation) => this.reservations.push(reservation); 
}*/

function Reservation(id, userId=null, bags=[], timestamp, status="active"){
    this.id = id;
    this.userId = userId;
    this.bags = bags;
    this.timestamp = timestamp;
    this.status = status;

    //TODO: review this method, add tests.
    // Adds a bag to the cart if it meets all constraints
    this.addBag = (bag) => {
        let now = dayjs(); // Current time
        let pickUpTime = dayjs(bag.timeToPickUp); // Bag's pick-up time

        // Check if the bag is already in the cart
        if (this.bags.some(b => b.id === bag.id)) {
            console.log("Bag is already in the cart.");
            return false;
        }

        // Ensure pick-up time is in the future
        const isFutureTime = pickUpTime.isAfter(now, 'minute');
        const isValidTodayTime = pickUpTime.isAfter(now, 'day') || pickUpTime.hour() > now.hour();

        // Bag must be available and within valid pick-up time constraints
        if (isFutureTime && isValidTodayTime && bag.state === "available") {
            this.bags.push(bag);
            console.log("Bag added to the reservation.");
            return true;
        }

        return false;
    };

    this.cancelReservation = function () {
        this.bags.forEach(bag => bag.state = "available");
        this.bags = []; // Clear the bags
        this.status = "canceled"
        console.log("Reservation canceled.");
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

function createObjects(){
    // Creation of 3 restaurants/stores
    const establishment1 = new Establishment(1, "Ristorante Bella Italia", "Via Roma 10, Milano", "0234567890", "Italian", "restaurant");
    const establishment2 = new Establishment(2, "Sushi Master", "Piazza Venezia 5, Roma", "0645678901", "Japanese", "restaurant");
    const establishment3 = new Establishment(3, "Supermarket Fresh", "Corso Torino 15, Napoli", "0816789012", "Grocery", "store");

    // Creation of some food items
    const food1 = new FoodItem(1, "Pizza Margherita", 1);
    const food2 = new FoodItem(2, "Pasta alla Carbonara", 1);
    const food3 = new FoodItem(3, "Sushi Misto", 8);
    const food4 = new FoodItem(4, "Banana", 3);
    const food5 = new FoodItem(5, "Mela Rossa", 2);

    // Creation of some bags (surprise and regular)
    const surpriseBag1 = new Bag(101, "surprise", "medium", [], 5.99, 1, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'));
    const regularBag1 = new Bag(102, "regular", "small", [food1, food2], 6.99, 1, dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm'));

    const surpriseBag2 = new Bag(103, "surprise", "large", [], 7.99, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm'));
    const regularBag2 = new Bag(104, "regular", "medium", [food3, food4], 8.49, 2, dayjs().add(2, 'day').format('YYYY-MM-DD HH:mm'));

    const surpriseBag3 = new Bag(105, "surprise", "small", [], 4.49, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm'));
    const regularBag3 = new Bag(106, "regular", "large", [food4, food5], 5.99, 3, dayjs().add(3, 'day').format('YYYY-MM-DD HH:mm'));

    // Adding bags to establishments
    establishment1.addBag(surpriseBag1);
    establishment1.addBag(regularBag1);
    establishment2.addBag(surpriseBag2);
    establishment2.addBag(regularBag2);
    establishment3.addBag(surpriseBag3);
    establishment3.addBag(regularBag3);

    // Creation of reservations
    const reservation1 = new Reservation(201, "user123", [surpriseBag1, regularBag1], dayjs().format('YYYY-MM-DD HH:mm'));
    const reservation2 = new Reservation(202, "user456", [regularBag2], dayjs().format('YYYY-MM-DD HH:mm'));

    // Creation of a shopping cart
    const shoppingCart = new ShoppingCart(301, "user123");
    shoppingCart.addReservation(reservation1);

    // TODO: adding a function to display the data without using global variables
    console.log("----- ESTABLISHMENTS -----");
    establishment1.display();
    establishment2.display();
    establishment3.display();

    console.log("----- BAGS -----");
    surpriseBag1.display();
    surpriseBag2.display();
    regularBag1.display();
    regularBag2.display();
    surpriseBag3.display();

    console.log("----- RESERVATIONS -----");
    reservation1.display();
    reservation2.display();

    console.log("----- SHOPPING CART -----");
    shoppingCart.display();
}

function main(){
    createObjects();
}

main();