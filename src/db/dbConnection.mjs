import sqlite from 'sqlite3';

const db = new sqlite.Database('./src/db/database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');    

});

// Open Connection to sqlite3 database
export const openConnection = () => {
    if (!db) {
        return new Error('Database connection not initialized.');
    }
    console.log('Database connection is open.');
    return db;
};

// Close Connection to sqlite3 database
export const closeConnection = () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};

export default { openConnection, closeConnection };
