import User from './User.mjs';

/**
 * Collection of User with utility methods for management.
 */

function UserCollection() {
    this.users = [];

    this.add = function(user) {
        this.users.push(user);
        return user;
    }

    this.getById = function(id) {
        return this.users.find(user => user.id === id);
    }

    this.getByEmail = function(email) {
        return this.users.find(user => user.email === email);
    }

    this.getAll = function() {
        return [...this.users];
    }

    this.removeById = function(id) {
        const index = this.users.findIndex(user => user.id === id);
        if(index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        return null;
    }
}

export default UserCollection;