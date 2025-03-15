import dbConnection from "../db/dbConnection.mjs";
import Reservation from "../models/Reservation.mjs";
import User from "../models/User.mjs";
import Bag from "../models/Bag.mjs";

// Get all reservations from the database, including associated User and Bags
export async function getAllReservations() {
    const db = await dbConnection.openConnection();
    return new Promise((resolve, reject) => {
        // Query to join Reservation with User and Bag
        // TODO: add size and type
        db.all(`
            SELECT 
                r.ReservationID, 
                r.TimeStamp, 
                r.Status, 
                r.UserID, 
                r.CreationDate, 
                b.BagID, 
                b.Price, 
                b.EstablishmentID, 
                b.TimeToPickUp, 
                b.State, 
                u.UserID as UserID, 
                u.Username as UserName,  
                u.Email as UserEmail
            FROM Reservation r
            LEFT JOIN Bag b ON r.BagID = b.BagID
            LEFT JOIN User u ON r.UserID = u.UserID;
        `, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Create a map of reservations by ID
                const reservationsMap = new Map();

                rows.forEach(row => {
                    // Create or get the existing reservation
                    let reservation = reservationsMap.get(row.ReservationID);
                    if (!reservation) {
                        reservation = new Reservation(
                            row.ReservationID,
                            row.TimeStamp,
                            row.Status,
                            [],
                            row.UserID,
                            row.CreationDate
                        );
                        reservationsMap.set(row.ReservationID, reservation);
                    }

                    // Create a Bag object and add it to the reservation if it exists
                    if (row.BagID) {
                        const bag = new Bag(
                            row.BagID,
                            row.Type,
                            row.Size,
                            row.Content ? JSON.parse(row.Content) : [], // Assuming content is stored as JSON string
                            row.Price,
                            row.EstablishmentID,
                            row.TimeToPickUp,
                            row.State
                        );
                        reservation.addBag(bag);
                    }

                    // Associate user with the reservation, if not already done
                    if (row.UserID && !reservation.user) {
                        reservation.user = new User(row.UserID, row.UserName, row.UserEmail);
                    }
                });

                // Resolve with an array of reservations
                resolve(Array.from(reservationsMap.values()));
            }
        });
    });
}

export default getAllReservations;
