import Establishment from './Establishment.mjs';

/**
 * Collection of Establishments with utility methods for management.
 */
function EstablishmentCollection() {
    this.establishments = [];

    this.add = function(establishment) {
        this.establishments.push(establishment);
        return establishment;
    }

    this.getById = function(id) {
        return this.establishments.find(est => est.id === id);
    }

    this.getAll = function() {
        return [...this.establishments];
    }

    this.getSortedByName = function() {
        return [...this.establishments].sort((a, b) => a.name.localeCompare(b.name));
    }

    this.getByType = function(type) {
        return this.establishments.filter(est => est.type === type);
    }

    this.getByCategory = function(category) {
        return this.establishments.filter(est => est.category === category);
    }

    this.remove = function(id) {
        const index = this.establishments.findIndex(est => est.id === id);
        if(index !== -1) {
            return this.establishments.splice(index, 1)[0];
        }
        return null;
    }
}

export default EstablishmentCollection;