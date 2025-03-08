/**
 * Constructor function for creating a Establishment object.
 */
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

export default Establishment;
