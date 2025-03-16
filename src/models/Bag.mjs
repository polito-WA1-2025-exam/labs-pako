import dayjs from 'dayjs';

/*
 Constructor function to create on object Bag
 */
function Bag(id, type, size, content = [], price, establishmentId, daysToPickUp, state = "available", userId = null, removedItems = [], creationDate = null) {
    
    this.id = id;
    this.type = type; // "surprise" or "regular"
    this.size = size;
    this.price = price;
    this.establishmentId = establishmentId;
    this.state = state;
    this.userId = userId;
    this.removedItems = removedItems;

    // Convert content array to a standardized format
    this.content = Array.isArray(content) 
        ? content.map(item => ({
            id: item.FoodItemID, 
            quantity: item.Quantity
        })) 
        : [];

    // Parse timeToPickUp using dayjs
    this.timeToPickUp = dayjs(daysToPickUp, 'YYYY-MM-DD HH:mm:ss').isValid() 
        ? dayjs(daysToPickUp, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') 
        : dayjs().add(daysToPickUp, 'day').format('YYYY-MM-DD HH:mm'); 

    // Parse creationDate using dayjs
    this.creationDate = dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').isValid() 
        ? dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') 
        : dayjs().add(creationDate, 'day').format('YYYY-MM-DD HH:mm'); 

    // Method to add a food item to the bag
    this.addFoodItem = function (foodItem) {
        if (this.type.toLowerCase() === "regular") {
            this.content.push(foodItem);
            console.log("Added Food Item into Bag");
            return true;
        }
        console.log("Cannot add specific food items to surprise bags");
        return false;
    };

    // Method to remove a food item from the bag
    this.removeFoodItem = function (foodItemId) {

        // Check if the bag is a regular bag
        if (this.type.toLowerCase() !== "regular") {
            console.log("Cannot remove food items from surprise bags");
            return false;
        }

        // Check if the bag already has 2 removed items
        if (this.removedItems.length >= 2) {
            console.log("Cannot remove more than 2 items from a regular bag");
            return false;
        }

        // Check if the food item exists in the bag
        const index = this.content.findIndex(item => item.id === foodItemId);
        if (index !== -1) {
            const removedItem = this.content.splice(index, 1)[0];
            this.removedItems.push(removedItem);
            console.log(`Removed ${removedItem.name} from the bag`);
            return true;
        }

        console.log("Food item not found in the bag");
        return false;
    }

    // Method to reserve a bag
    this.reserve = function (userId) {
        // Check if the bag is available
        if (this.state === "available") {
            this.state = "reserved";
            this.userId = userId;
            console.log(`Bag ${this.id} reserved by user ${userId}`);
            return true;
        }
        console.log(`Bag ${this.id} is not available for reservation`);
        return false;
    }

    // Method to release a bag
    this.release = function () {
        // Check if the bag is reserved
        if (this.state === "reserved") {
            this.state = "available";
            this.userId = null;
            console.log(`Bag ${this.id} released and now available`);
            return true;
        }
        console.log(`Bag ${this.id} is not reserved`);
        return false;
    }

    // Method to display bag information
    this.display = () => {
        console.log(`Type: ${this.type}`);
        console.log(`Size: ${this.size}`);
        console.log(`User ID: ${this.userId}`);
        console.log(`Creation Date: ${this.creationDate}`);
        console.log(`Price: ${this.price}`);
        console.log(`Establishment ID: ${this.establishmentId}`);
        console.log(`Time to pick up: ${this.timeToPickUp}`);
        console.log("Removed Items:");
        this.removedItems.forEach(item => {
            console.log(`RemovedItemID: ${item.RemovedItemID}, Quantity: ${item.Quantity}, CreationDate: ${item.CreationDate}`);
        });
        console.log(`State: ${this.state}`);
        if (this.type.toLowerCase() === "regular") {
            console.log(`Contents:`);
            // Ensure that content is an array before calling forEach
            this.content.forEach(item => console.log(` Id: ${item.id}, quantity: ${item.quantity}`));
        }
        console.log('--------------------------');
    }    
}

export default Bag;
