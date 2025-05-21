import dbConnection from "../db/dbConnection.mjs";
import ShoppingCart from "../models/ShoppingCart.mjs";
import Bag from "../models/Bag.mjs";
import { getReservationById } from "./reservationQueries.mjs";

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
                            const reservation = await getReservationById(row.ReservationID);
                            reservations.push(reservation);
                        } catch (e) {
                            console.error("Error fetching reservation: ", e);
                        }
                    }
                    let allergies = row.Allergies ? row.Allergies.split(',') : [];
                    let requests = row.Requests ? row.Requests.split(',') : [];
                    const shoppingCart = new ShoppingCart(
                        row.ShoppingCartID,
                        row.UserID,
                        reservations,
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

// Get shopping cart details and associated bags for a given User ID
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
                cartDetails = {
                    id: rowCart.ShoppingCartID,
                    userId: rowCart.UserID,
                    reservationId: rowCart.ReservationID,
                    allergies: rowCart.Allergies ? rowCart.Allergies.split(',') : [],
                    requests: rowCart.Requests ? rowCart.Requests.split(',') : []
                };
                allergies = cartDetails.allergies;
                requests = cartDetails.requests;
                reservationId = cartDetails.reservationId;
            }
            
            // 2. Fetch bags associated with this UserID that are in the cart state
            db.all('SELECT * FROM Bag WHERE UserID = ? AND State = "available"', [userId], (errBags, rowsBags) => {
                if (errBags) {
                    return reject(errBags);
                }
                
                // Map bag rows to Bag objects
                const bagItems = rowsBags.map(row => new Bag(
                    row.BagID,
                    row.Type,
                    row.Size,
                    row.RemovedItems,
                    row.Price,
                    row.State,
                    row.UserID,
                    row.EstablishmentID,
                    row.TimeToPickUp,
                    row.CreationDate
                ));
                
                // Combine cart details and bag items into the desired structure
                const userShoppingCart = {
                    id: cartDetails ? cartDetails.id : null,
                    userId: userId,
                    reservationId: reservationId,
                    allergies: allergies,
                    requests: requests,
                    items: bagItems
                };
                
                resolve(userShoppingCart);
            });
        });
    });
}

// New function to add a bag to a user's shopping cart
export async function addBagToUserCart(userId, bagId) {
    const db = await dbConnection.openConnection();
    return new Promise(async (resolve, reject) => {
        // Start a transaction for atomicity
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // 1. Check if the bag exists and is available
            db.get('SELECT * FROM Bag WHERE BagID = ? AND State = "available"', [bagId], (errBag, rowBag) => {
                if (errBag) {
                    db.run('ROLLBACK');
                    return reject(errBag);
                }
                
                if (!rowBag) {
                    db.run('ROLLBACK');
                    return reject(new Error('Bag not found or not available'));
                }
                
                // 2. Check if the user already has a ShoppingCart entry
                db.get('SELECT * FROM ShoppingCart WHERE UserID = ?', [userId], (errCart, rowCart) => {
                    if (errCart) {
                        db.run('ROLLBACK');
                        return reject(errCart);
                    }
                    
                    // If user doesn't have a shopping cart yet, create one
                    const createOrUpdateCart = () => {
                        if (!rowCart) {
                            db.run(
                                'INSERT INTO ShoppingCart (UserID, Allergies, Requests) VALUES (?, ?, ?)',
                                [userId, '', ''],
                                function(errInsert) {
                                    if (errInsert) {
                                        db.run('ROLLBACK');
                                        return reject(errInsert);
                                    }
                                    
                                    // Update the bag to associate it with the user
                                    updateBag(this.lastID);
                                }
                            );
                        } else {
                            // User already has a cart, just update the bag
                            updateBag(rowCart.ShoppingCartID);
                        }
                    };
                    
                    // Update the bag to associate it with the user
                    const updateBag = (shoppingCartId) => {
                        db.run(
                            'UPDATE Bag SET UserID = ? WHERE BagID = ?',
                            [userId, bagId],
                            function(errUpdate) {
                                if (errUpdate) {
                                    db.run('ROLLBACK');
                                    return reject(errUpdate);
                                }
                                
                                if (this.changes === 0) {
                                    db.run('ROLLBACK');
                                    return reject(new Error('Failed to update bag with user ID'));
                                }
                                
                                // Commit the transaction
                                db.run('COMMIT');
                                
                                // Return success response with updated shopping cart
                                resolve({
                                    success: true,
                                    message: 'Bag added to user cart successfully',
                                    bagId: bagId,
                                    userId: userId,
                                    shoppingCartId: shoppingCartId
                                });
                            }
                        );
                    };
                    
                    createOrUpdateCart();
                });
            });
        });
    });
}

export default {
    getAllShoppingCarts,
    getShoppingCartByUserId,
    addBagToUserCart
};