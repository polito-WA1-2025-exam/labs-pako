import dbConnection from "../db/dbConnection.mjs";
import ShoppingCart from "../models/ShoppingCart.mjs"; // Assuming you have a ShoppingCart model
import Bag from "../models/Bag.mjs"; // Assuming you have a Bag model
import { getReservationById } from "./reservationQueries.mjs"; // Keep if needed for reservation details

// Function to get all shopping carts from the database (existing)
export async function getAllShoppingCarts() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ShoppingCart', [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const shoppingCarts = await Promise.all(rows.map(async (row) => {
                    let reservations = [];
                    if (row.ReservationID) {
                        try {
                            // Note: getReservationById might need implementation
                            const reservation = await getReservationById(row.ReservationID);
                            reservations.push(reservation);
                        } catch (e) {
                            console.error("Error fetching reservation: ", e);
                        }
                    }

                    let allergies = row.Allergies ? row.Allergies.split(',') : [];
                    let requests = row.Requests ? row.Requests.split(',') : [];

                    // IMPORTANT: This existing code structure doesn't include 'items' (bags)
                    // in the ShoppingCart model. The new function below will handle this.
                    const shoppingCart = new ShoppingCart(
                        row.ShoppingCartID,
                        row.UserID,
                        reservations, // This seems inconsistent with a typical cart holding multiple items
                        allergies,
                        requests
                    );
                    return shoppingCart;
                }));
                resolve(shoppingCarts);
            }
        });
    });
}

// New function to get shopping cart details and associated bags for a given User ID
export async function getShoppingCartByUserId(userId) {
    const db = await dbConnection.openConnection();
    return new Promise(async (resolve, reject) => {
        // 1. Fetch the ShoppingCart entry for the user
        db.get('SELECT * FROM ShoppingCart WHERE UserID = ?', [userId], async (errCart, rowCart) => {
            if (errCart) {
                return reject(errCart);
            }

            let cartDetails = null;
            let allergies = [];
            let requests = [];
            let reservationId = null;

            if (rowCart) {
                // Shopping cart entry found, process its details
                cartDetails = { // Create a simple object for cart details
                    id: rowCart.ShoppingCartID,
                    userId: rowCart.UserID,
                    reservationId: rowCart.ReservationID, // Might be null
                    allergies: rowCart.Allergies ? rowCart.Allergies.split(',') : [],
                    requests: rowCart.Requests ? rowCart.Requests.split(',') : []
                };
                allergies = cartDetails.allergies;
                requests = cartDetails.requests;
                reservationId = cartDetails.reservationId;
            } else {
                 // No shopping cart entry found for this user yet.
                 // We can still look for bags associated directly with the user.
                 // The controller will handle returning a default empty cart object.
            }


            // 2. Fetch bags associated with this UserID that are potentially in the cart state
            // Assuming bags linked to the UserID in the Bag table represent items in the cart
            // (before being moved to a confirmed reservation).
            // We might need a state check here if the schema had one like 'in-cart'.
            // For now, let's fetch all bags linked to the user that are 'available'.
            // NOTE: The logic for determining which bags are 'in cart' vs 'reserved' vs 'picked up'
            // is crucial and depends heavily on your application's state management and how
            // Bag.UserID and Reservation table are used together.
            // A more robust approach might involve checking if a BagID linked to this UserID
            // exists in an UNCONFIRMED Reservation, or checking a state column in the Bag table.
            // Using State = 'available' for bags *linked to a user* as 'in cart' is a simple
            // interpretation based on the default state. Adjust the WHERE clause based on your
            // actual application logic for cart items.

            db.all('SELECT * FROM Bag WHERE UserID = ? AND State = "available"', [userId], (errBags, rowsBags) => {
                if (errBags) {
                    // If bags query fails, reject, or decide how to handle partial failure
                    return reject(errBags);
                }

                // Map bag rows to Bag objects (assuming Bag model constructor matches DB fields)
                const bagItems = rowsBags.map(row => new Bag(
                    row.BagID,
                    row.Type,
                    row.Size,
                    row.RemovedItems, // This is a string, might need parsing
                    row.Price,
                    row.State,
                    row.UserID, // This should match the queried userId
                    row.EstablishmentID,
                    row.TimeToPickUp,
                    row.CreationDate
                    // Add other Bag fields if your Bag model has them
                ));

                // Combine cart details and bag items into the desired structure
                const userShoppingCart = {
                    id: cartDetails ? cartDetails.id : null, // ShoppingCartID if exists
                    userId: userId, // User ID is always known
                    reservationId: reservationId, // Reservation ID if linked
                    allergies: allergies,
                    requests: requests,
                    items: bagItems // Array of Bag objects
                };


                // Resolve the promise with the complete shopping cart data
                resolve(userShoppingCart);
            });
        });
    });
}

// Update the default export to include the new function
export default {
    getAllShoppingCarts,
    getShoppingCartByUserId
    // Add other shopping cart query functions here as you implement them (add, remove, clear)
};

/*
   NOTE: You will likely need to create the Bag model (Bag.mjs)
   if it doesn't exist, similar to how ShoppingCart.mjs and User.mjs are structured.
   Example Bag.mjs:

   class Bag {
       constructor(BagID, Type, Size, RemovedItems, Price, State, UserID, EstablishmentID, TimeToPickUp, CreationDate) {
           this.bagId = BagID;
           this.type = Type;
           this.size = Size;
           this.removedItems = RemovedItems; // Might need parsing depending on format
           this.price = Price;
           this.state = State;
           this.userId = UserID;
           this.establishmentId = EstablishmentID;
           this.timeToPickUp = TimeToPickUp;
           this.creationDate = CreationDate;
       }
   }
   export default Bag;

*/