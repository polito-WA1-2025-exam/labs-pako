import FoodItem from './FoodItem.mjs';

/**
 * Collection of FoodItems with utility methods for management.
 */
function FoodItemCollection() {
    this.items = [];

    this.add = function (foodItem) {
        this.items.push(foodItem);
        return foodItem;
    };

    this.getById = function (id) {
        return this.items.find(item => item.id === id);
    };

    this.getAll = function () {
        return [...this.items];
    };

    this.remove = function (id) {
        const index = this.items.findIndex(item => item.id === id);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    };
}

export default FoodItemCollection;
