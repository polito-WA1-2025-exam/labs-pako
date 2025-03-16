import dbConnection from "../db/dbConnection.mjs";
import ShoppingCart from "../models/ShoppingCart.mjs";

// Function to get all shopping carts from the database
export async function getAllShoppingCarts() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ShoppingCart', [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Map the fields from the result of the database to the fields of the ShoppingCart constructor
                const shoppingCarts = await Promise.all(rows.map(async (row) => {
                    // Fetching reservations associated with this shopping cart, if any
                    let reservations = [];
                    if (row.ReservationID) {
                        try {
                            const reservation = await getReservationById(row.ReservationID);
                            reservations.push(reservation);
                        } catch (e) {
                            console.error("Error fetching reservation: ", e);
                        }
                    }

                    // Fetch allergies and special requests from the shopping cart
                    let allergies = row.Allergies ? row.Allergies.split(',') : [];
                    let requests = row.Requests ? row.Requests.split(',') : [];

                    // Create a ShoppingCart object for each row in the result
                    const shoppingCart = new ShoppingCart(
                        row.ShoppingCartID,  // ShoppingCartID to id
                        row.UserID,           // UserID to userId
                        reservations,         // Reservations associated with this cart
                        allergies,            // Allergies list
                        requests              // Special requests list
                    );

                    return shoppingCart;
                }));

                resolve(shoppingCarts);  // Resolve the promise with all the shopping carts
            }
        });
    });
}

// Function to get a reservation by its ID
async function getReservationById(reservationId) {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Reservation WHERE ReservationID = ?', [reservationId], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row); // Returning the reservation
            }
        });
    });
}

// You can add additional query functions here, for example, for adding, updating or deleting shopping carts

export default getAllShoppingCarts;
