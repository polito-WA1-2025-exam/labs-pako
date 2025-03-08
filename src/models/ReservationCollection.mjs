import Reservation from './Reservation.mjs';

/**
 * Collection of Resarvations with utility methods for management.
 */

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


export default ReservationCollection;