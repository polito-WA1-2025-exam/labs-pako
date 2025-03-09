import dayjs from 'dayjs';

/*
 Constructor function to create on object Bag
 */
function Bag(id, type, size, content = [], price, establishmentId, daysToPickUp, state = "available", userId = null, removedItems = []) {
    this.id = id;
    this.type = type; // "surprise" or "regular"
    this.size = size;
    this.content = content;
    this.price = price;
    this.establishmentId = establishmentId;
    this.timeToPickUp = dayjs().add(daysToPickUp, 'day').format('YYYY-MM-DD HH:mm');
    this.state = state;
    this.userId = userId;
    this.removedItems = removedItems;

    this.addFoodItem = function (foodItem) {
        if (this.type.toLowerCase() === "regular") {
            this.content.push(foodItem);
            console.log("Added Food Item into Bag");
            return true;
        }
        console.log("Cannot add specific food items to surprise bags");
        return false;
    }

    this.removeFoodItem = function (foodItemId) {
        if (this.type.toLowerCase() !== "regular") {
            console.log("Cannot remove food items from surprise bags");
            return false;
        }

        if (this.removedItems.length >= 2) {
            console.log("Cannot remove more than 2 items from a regular bag");
            return false;
        }

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

    this.reserve = function (userId) {
        if (this.state === "available") {
            this.state = "reserved";
            this.userId = userId;
            console.log(`Bag ${this.id} reserved by user ${userId}`);
            return true;
        }
        console.log(`Bag ${this.id} is not available for reservation`);
        return false;
    }

    this.release = function () {
        if (this.state === "reserved") {
            this.state = "available";
            this.userId = null;
            console.log(`Bag ${this.id} released and now available`);
            return true;
        }
        console.log(`Bag ${this.id} is not reserved`);
        return false;
    }

    this.display = function () {
        console.log(`Type: ${this.type}`);
        console.log(`Size: ${this.size}`);
        console.log(`Price: ${this.price}`);
        console.log(`Establishment ID: ${this.establishmentId}`);
        console.log(`Time to pick up: ${this.timeToPickUp}`);
        console.log(`State: ${this.state}`);
        if (this.type.toLowerCase() === "regular") {
            console.log(`Contents:`);
            this.content.forEach(item => console.log(`  - ${item.quantity}x ${item.name}`));
        }
        console.log('--------------------------');
    }
}

export default Bag;
