/**
 * Constructor function for creating a FoodItem object.
 */
function FoodItem(id, name, quantity, creationDate=null) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.creationDate = creationDate;

    this.display = function() {
        console.log(`Food Item ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Quantity: ${this.quantity}`);
        console.log(`Creation Date: ${this.creationDate}`);
        console.log('--------------------------');
    }
}

export default FoodItem;
