import ShoppingCart from './ShoppingCart.mjs';  

/**
 * ShoppingCart Collection with methods to manage shopping carts
 */
function ShoppingCartCollection() {
    this.shoppingCarts = [];

    // Adds a shopping cart to the collection
    this.add = function (shoppingCart) {
        this.shoppingCarts.push(shoppingCart);
        return shoppingCart;
    };

    // Gets a shopping cart by its ID
    this.getById = function (id) {
        return this.shoppingCarts.find(cart => cart.id === id);
    };

    // Gets all shopping carts
    this.getAll = function () {
        return [...this.shoppingCarts];
    };

    // Gets all shopping carts for a specific user by userId
    this.getByUserId = function (userId) {
        return this.shoppingCarts.filter(cart => cart.userId === userId);
    };

    // Removes a shopping cart by its ID
    this.removeById = function (id) {
        const index = this.shoppingCarts.findIndex(cart => cart.id === id);
        if (index !== -1) {
            return this.shoppingCarts.splice(index, 1)[0];
        }
        return null;
    };

    // Clears all shopping carts
    this.clearAll = function () {
        this.shoppingCarts = [];
    };

    // Displays all shopping carts
    this.displayAll = function () {
        this.shoppingCarts.forEach(cart => cart.display());
    };
}

export default ShoppingCartCollection;
