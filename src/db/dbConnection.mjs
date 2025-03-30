import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build the path to the DB file
const databasePath = path.join(__dirname, 'myDatabase.db');

// Connect to the DB
const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("❌ Error opening database:", err.message);
    } else {
        console.log('✅ Connected to the database.');
    }
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
