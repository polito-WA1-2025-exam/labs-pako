/**
 * Constructor function for creating a FoodItem object.
 */
function FoodItem(id, name, quantity) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;

    this.display = function() {
        console.log(`Food Item ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Quantity: ${this.quantity}`);
        console.log('--------------------------');
    }
}

export default FoodItem;
