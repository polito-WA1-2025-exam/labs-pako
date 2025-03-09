import Bag from './Bag.mjs';
import dayjs from 'dayjs';
/**
 * Bag Collection with methods to manage bags
 */
function BagCollection() {
    this.bags = [];

    this.add = function (bag) {
        this.bags.push(bag);
        return bag;
    }

    this.getById = function (id) {
        return this.bags.find(bag => bag.id === id);
    }

    this.getAll = function () {
        return [...this.bags];
    }

    this.getAvailable = function () {
        return this.bags.filter(bag => bag.state === "available");
    }

    this.getReserved = function () {
        return this.bags.filter(bag => bag.state === "reserved");
    }

    this.getByEstablishment = function (establishmentId) {
        return this.bags.filter(bag => bag.establishmentId === establishmentId);
    }

    this.getByType = function (type) {
        return this.bags.filter(bag => bag.type === type);
    }

    this.getBySize = function (size) {
        return this.bags.filter(bag => bag.size === size);
    }

    this.removeById = function (id) {
        const index = this.bags.findIndex(bag => bag.id === id);
        if (index !== -1) {
            return this.bags.splice(index, 1)[0];
        }
        return null;
    }

    this.sortByDate = function () {
        this.bags.sort((a, b) => {
            const dateA = dayjs(a.timeToPickUp);
            const dateB = dayjs(b.timeToPickUp);
            return dateA.diff(dateB);
        });
    }
}

export default BagCollection;