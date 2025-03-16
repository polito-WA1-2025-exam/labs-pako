import dayjs from 'dayjs';
/**
 * Constructor function for creating a FoodItem object.
 */
function FoodItem(id, name, quantity, creationDate=null) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;  
    // Parse creationDate using dayjs
    this.creationDate = dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').isValid() 
        ? dayjs(creationDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') 
        : dayjs().add(creationDate, 'day').format('YYYY-MM-DD HH:mm');    

    this.display = function() {
        console.log(`Food Item ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Quantity: ${this.quantity}`);
        console.log(`Creation Date: ${this.creationDate}`);
        console.log('--------------------------');
    }
}

export default FoodItem;
