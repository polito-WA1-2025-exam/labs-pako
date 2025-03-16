import dayjs from 'dayjs';
/**
 * Constructor function for creating a ShoppingCart object.
 */
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
    this.removeReservationById = (reservationId) => {
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
        this.reservations.reduce((total, reservation) => {
            if (reservation.bags && reservation.bags.length > 0) {
                return total + reservation.bags.reduce((sum, bag) => sum + bag.price, 0);
            }
            return total; // Se non ci sono borse, ritorna il totale senza aggiungere nulla
        }, 0);
        
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
        this.reservations.forEach(reservation => {
            console.log(`Reservation ID: ${reservation.ReservationID}`);
            console.log(`Timestamp: ${reservation.TimeStamp}`);
            console.log(`BagId: ${reservation.BagID}`);
            console.log(`Status: ${reservation.Status}`);
            console.log("UserID: ", reservation.UserID);    
        });
        console.log('--------------------------');
    };
}

export default ShoppingCart;