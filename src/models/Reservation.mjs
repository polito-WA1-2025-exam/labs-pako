import dayjs from 'dayjs';
/*
 Constructor function to create on object Reservation
 */
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

    this.removeBagById = (bagId) => {
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

export default Reservation;