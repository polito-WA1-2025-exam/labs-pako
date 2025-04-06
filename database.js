const sqlite3 = require('sqlite3').verbose();  // Importa il modulo sqlite3

// Crea (o apre) un database SQLite
const db = new sqlite3.Database('food_bags.db', (err) => {
    if (err) {
        console.error('Errore nell\'apertura del database:', err.message);
    } else {
        console.log('Database SQLite creato/aperto con successo');
    }
});

// Crea le tabelle nel database
function createTables() {
    // Crea la tabella users
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        User_ID INTEGER PRIMARY KEY,
        Username TEXT,
        Email TEXT,
        Role TEXT
    )`);

    // Crea la tabella establishments
    db.run(`
    CREATE TABLE IF NOT EXISTS establishments (
        Est_ID INTEGER PRIMARY KEY,
        Name_Est TEXT,
        Address TEXT,
        Telephone TEXT,
        Food_Category TEXT,
        Type_Of_Est TEXT,
        AvailableBags INTEGER,
        ReservedBags INTEGER
    )`);

    // Crea la tabella food
    db.run(`
    CREATE TABLE IF NOT EXISTS food (
        Food_ID INTEGER PRIMARY KEY,
        Food_Name TEXT,
        Quantity INTEGER,
        Bag_ID INTEGER,
        Price REAL,
        Size TEXT,
        Establishment_ID INTEGER,
        Time_Range TEXT,
        State TEXT,
        UserID INTEGER,
        FOREIGN KEY (Bag_ID) REFERENCES bags(Bag_ID),
        FOREIGN KEY (Establishment_ID) REFERENCES establishments(Est_ID),
        FOREIGN KEY (UserID) REFERENCES users(User_ID)
    )`);

    // Crea la tabella bags
    db.run(`
    CREATE TABLE IF NOT EXISTS bags (
        Bag_ID INTEGER PRIMARY KEY,
        Type_of_Bag TEXT,
        Content TEXT,
        Food_ID INTEGER,
        Establishment_ID INTEGER,
        Size TEXT,
        FOREIGN KEY (Food_ID) REFERENCES food(Food_ID),
        FOREIGN KEY (Establishment_ID) REFERENCES establishments(Est_ID)
    )`);

    // Crea la tabella shopping_cart
    db.run(`
    CREATE TABLE IF NOT EXISTS shopping_cart (
        Cart_ID INTEGER PRIMARY KEY,
        User_ID INTEGER,
        FOREIGN KEY (User_ID) REFERENCES users(User_ID)
    )`);

    // Crea la tabella reservations
    db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
        Res_ID INTEGER PRIMARY KEY,
        User_ID INTEGER,
        Bag_ID INTEGER,
        Timestamp DATETIME,
        Status TEXT,
        Allergies TEXT,
        Requests TEXT,
        FOREIGN KEY (User_ID) REFERENCES users(User_ID),
        FOREIGN KEY (Bag_ID) REFERENCES bags(Bag_ID)
    )`);
}

// Chiama la funzione per creare le tabelle
createTables();
