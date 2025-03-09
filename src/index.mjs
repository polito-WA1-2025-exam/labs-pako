import {createObjects} from './services/dataService.mjs';

function main(){
    // Call createObjects to generate the collections
    const { foodItems, bags, establishments, users, reservations } = createObjects();   
    
    // Example of using the collections
    console.log("\n===== EXAMPLES OF USING COLLECTIONS =====\n");
    
    // Get all restaurants
    console.log("----- ALL RESTAURANTS -----");
    const allRestaurants = establishments.getByType("restaurant");
    allRestaurants.forEach(rest => console.log(rest.name));

    // Get all surprise bags
    console.log("\n----- ALL SURPRISE BAGS -----");
    const surpriseBags = bags.getByType("surprise");
    console.log(`Total surprise bags: ${surpriseBags.length}`);
    
    // Get all medium-sized bags
    console.log("\n----- ALL MEDIUM BAGS -----");
    const mediumBags = bags.getBySize("medium");
    console.log(`Total medium bags: ${mediumBags.length}`);
    
    // Get all bags from a specific establishment
    console.log("\n----- BAGS FROM ESTABLISHMENT 1 -----");
    const bagsFromEst1 = bags.getByEstablishment(1);
    console.log(`Total bags from Establishment 1: ${bagsFromEst1.length}`);
    
    // Example of removing a food item from a regular bag
    console.log("\n----- REMOVING FOOD ITEM FROM BAG -----");
    const user = users.getById("user123");
    const reservation = reservations.getByUserId("user123")[0];
    
    // Add a regular bag to the reservation for testing
    const regularBag = bags.getById(102);
    reservation.addBag(regularBag);
    
    // Remove a food item
    user.shoppingCart.removeFoodItemFromRegularBag(reservation.id, regularBag.id, 1);
    
    // View the updated bag
    console.log("\n----- UPDATED BAG AFTER REMOVING ITEM -----");
    user.shoppingCart.viewDetailsOfRegularBag(reservation.id, regularBag.id);
}

main()