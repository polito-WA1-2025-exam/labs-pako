import dayjs from 'days';

function FoodItem(id, name, quantity){
    this.id = id;
    this.name = name;
    this.quantity = quantity;
}

function Bag(id, type, size, content=[], size, price, establishmentId, timeToPickUp, state="available", userId=null, removedItems=[]){
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
    }

    this.display = () => {
        console.log(`Type: ${this.type}`);
        console.log(`Food Items: ${this.content}`);
        console.log(`Price: ${this.price}`);
        console.log(`Size: ${this.size}`);
        console.log(`Establishment ID: ${this.establishmentId}`);
        console.log(`Time to pick up: ${this.timeToPickUp}`);
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
            return true;
        }
        return false; //There is already a bag from this establishment
    }

}

function ShoppingCart(id, userId = null) {
    this.id = id;
    this.userId = userId;
    this.bags = [];
    this.allergies = [];
    this.requests = [];

    // Adds a bag to the cart with a restriction of one bag per establishment per day
    this.addBag = (bag) => {
        const today = dayjs().format('YYYY-MM-DD'); // Get only the date (YYYY-MM-DD)
        const alreadyInCart = this.bags.some(b => b.establishmentId === bag.establishmentId && b.date === today);

        if (alreadyInCart) {
            console.log("You can only add one bag per establishment per day.");
            return false;
        }

        this.bags.push(bag);
        return true;
    };

    // Removes a bag from the cart
    this.removeBag = (bagId) => {
        const index = this.bags.findIndex(bag => bag.id === bagId);
        if (index !== -1) {
            this.bags.splice(index, 1);
            console.log("Bag removed from the cart.");
            return true;
        }
        console.log("Bag not found in the cart.");
        return false;
    };

    // Adds an allergy to the list
    this.addAllergy = (allergy) => this.allergies.push(allergy);

    // Adds a special request
    this.addRequest = (request) => this.requests.push(request);

    // Calculates the total price (price does not change if items are removed from a regular bag)
    this.totalPrice = () => this.bags.reduce((total, bag) => total + bag.price, 0);

    // Confirms the order and updates the status of the bags to "Reserved" if they are available
    this.confirmOrder = function () {
        if (this.bags.some(bag => bag.state !== "available")) {
            console.log("Some bags are unavailable. Order canceled.");
            return false;
        }
        this.bags.forEach(bag => bag.state = "reserved");
        console.log("Order confirmed.");
        return true;
    };

    // Removes up to two items from a regular bag
    this.removeFoodItemFromRegularBag = (bagId, foodItem) => {
        const bag = this.bags.find(b => b.id === bagId);
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

        const itemIndex = bag.content.indexOf(foodItem);
        if (itemIndex !== -1) {
            bag.removedItems.push(bag.content.splice(itemIndex, 1)[0]);
            console.log(`${foodItem} removed from the bag.`);
            return true;
        }

        console.log("Item not found in the bag.");
        return false;
    };

    this.viewDetailsOfRegularBag = (bag) => {
        if(bag.type==="regular"){
            bag.display();
        }
    }
}


function User(id, name, email, password, shoppingCartId=null, reservations=[]){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.shoppingCartId = shoppingCartId; //TODO: check this strcutre, maybe you add this.shoppingCart = new ShoppingCart(id); ??
    this.reservations = reservations;

    this.addReservation = (reservation) => this.reservations.push(reservation); 
}

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
            return false;
        }

        // Ensure pick-up time is in the future
        const isFutureTime = pickUpTime.isAfter(now, 'minute');
        const isValidTodayTime = pickUpTime.isAfter(now, 'day') || pickUpTime.hour() > now.hour();

        // Bag must be available and within valid pick-up time constraints
        if (isFutureTime && isValidTodayTime && bag.state === "available") {
            this.bags.push(bag);
            return true;
        }

        return false;
    };

    this.cancelReservation = function () {
        this.bags.forEach(bag => bag.state = "available");
        this.bags = []; // Clear the bags
        this.status = "canceled"
    };   
   
}

function main(){


}

main();