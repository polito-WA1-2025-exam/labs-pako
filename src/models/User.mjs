import ShoppingCart from './ShoppingCart.mjs';
import dayjs from 'dayjs';
/*
 Constructor function to create on object User
 */
function User(id, name, email, creationDate = null, password = null){
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.shoppingCart = new ShoppingCart(id, id);
    this.reservations = [];
    this.creationDate = dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').isValid() 
        ? dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') 
        : dayjs().add(creationDate, 'day').format('YYYY-MM-DD HH:mm');  
    this.addReservation = function(reservation) {
        this.reservations.push(reservation);
        console.log(`Reservation ${reservation.id} added to user ${this.name}`);
        return true;
    }

    this.removeReservationById = function(reservationId) {
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
        console.log(`Creation Date: ${this.creationDate}`);
        console.log('--------------------------');
    }
}

export default User;