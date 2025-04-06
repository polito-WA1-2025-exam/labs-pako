import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

// Ottieni il percorso assoluto della directory corrente
const __dirname = path.resolve();

// Crea l'app Express
const app = express();

// Connessione al database SQLite
const db = new sqlite3.Database(path.join(__dirname, 'your-database.db'));

// Impostazione per il parsing di JSON nei body delle richieste
app.use(express.json());

// Esegui la creazione delle tabelle all'avvio del server
function createTables() {
    // Creazione tabella Food
    db.run(`
        CREATE TABLE IF NOT EXISTS Food (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Food_Name TEXT NOT NULL,
            Quantity INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Errore durante la creazione della tabella Food:", err.message);
        }
    });

    // Creazione tabella Bags
    db.run(`
        CREATE TABLE IF NOT EXISTS Bags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Bag_ID INTEGER NOT NULL,
            Type TEXT NOT NULL,
            Content TEXT,
            Price REAL NOT NULL,
            Size TEXT NOT NULL,
            Establishment_ID INTEGER NOT NULL,
            TimeRange TEXT NOT NULL,
            State TEXT NOT NULL,
            UserID INTEGER
        )
    `, (err) => {
        if (err) {
            console.error("Errore durante la creazione della tabella Bags:", err.message);
        }
    });

    // Creazione tabella Cart
    db.run(`
        CREATE TABLE IF NOT EXISTS Cart (
            Cart_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            User_ID INTEGER NOT NULL,
            Reservations TEXT,
            Allergies TEXT,
            Requests TEXT
        )
    `, (err) => {
        if (err) {
            console.error("Errore durante la creazione della tabella Cart:", err.message);
        }
    });

    // Creazione tabella Reservations
    db.run(`
        CREATE TABLE IF NOT EXISTS Reservations (
            Res_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            User_ID INTEGER NOT NULL,
            Bags TEXT NOT NULL,
            Timestamp TEXT NOT NULL,
            Status TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Errore durante la creazione della tabella Reservations:", err.message);
        }
    });

    // Creazione tabella Establishments
    db.run(`
        CREATE TABLE IF NOT EXISTS Establishments (
            Est_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name_Est TEXT NOT NULL,
            Address TEXT NOT NULL,
            Telephone TEXT NOT NULL,
            Food_Category TEXT NOT NULL,
            Type_Of_Est TEXT NOT NULL,
            AvailableBags INTEGER NOT NULL,
            ReservedBags INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Errore durante la creazione della tabella Establishments:", err.message);
        }
    });

    console.log("Tabelle create con successo.");
}

// Chiamata alla funzione per creare le tabelle all'avvio del server
createTables();

// Impostazione della porta del server
const port = 3000;
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

//Food CRUD
// CREATE: Aggiungi un nuovo alimento
app.post('/food', (req, res) => {
    const { Food_Name, Quantity } = req.body;
    const query = `INSERT INTO Food (Food_Name, Quantity) VALUES (?, ?)`;
    db.run(query, [Food_Name, Quantity], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// READ: Ottieni tutti gli alimenti
app.get('/food', (req, res) => {
    const { quantity } = req.query;  // Filtra per la quantità se specificata

    let query = `SELECT * FROM Food`;
    let params = [];

    if (quantity) {
        query += ` WHERE Quantity = ?`;
        params.push(quantity);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE: Modifica la quantità di un alimento
app.put('/food/:id', (req, res) => {
    const { id } = req.params;
    const { Quantity } = req.body;
    const query = `UPDATE Food SET Quantity = ? WHERE id = ?`;
    db.run(query, [Quantity, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// DELETE: Elimina un alimento
app.delete('/food/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Food WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

//Bags CRUD
// CREATE: Aggiungi una nuova borsa
app.post('/bags', (req, res) => {
    const { Bag_ID, Type, Content, Price, Size, Establishment_ID, TimeRange, State, UserID } = req.body;
    const query = `INSERT INTO Bags (Bag_ID, Type, Content, Price, Size, Establishment_ID, TimeRange, State, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [Bag_ID, Type, Content, Price, Size, Establishment_ID, TimeRange, State, UserID], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// READ: Ottieni tutte le borse
app.get('/bags', (req, res) => {
    const { type, state } = req.query;  // Filtra per tipo e stato

    let query = `SELECT * FROM Bags`;
    let params = [];

    if (type) {
        query += ` WHERE Type = ?`;
        params.push(type);
    }

    if (state) {
        query += type ? ` AND State = ?` : ` WHERE State = ?`;
        params.push(state);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});


// UPDATE: Modifica lo stato di una borsa
app.put('/bags/:id', (req, res) => {
    const { id } = req.params;
    const { State } = req.body;
    const query = `UPDATE Bags SET State = ? WHERE id = ?`;
    db.run(query, [State, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// DELETE: Elimina una borsa
app.delete('/bags/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Bags WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

//Cart CRUD
// CREATE: Aggiungi un nuovo carrello
app.post('/cart', (req, res) => {
    const { User_ID, Reservations, Allergies, Requests } = req.body;
    const query = `INSERT INTO Cart (User_ID, Reservations, Allergies, Requests) VALUES (?, ?, ?, ?)`;
    db.run(query, [User_ID, Reservations, Allergies, Requests], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// READ: Ottieni tutti i carrelli
app.get('/cart', (req, res) => {
    const query = `SELECT * FROM Cart`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE: Modifica un carrello
app.put('/cart/:id', (req, res) => {
    const { id } = req.params;
    const { Reservations, Allergies, Requests } = req.body;
    const query = `UPDATE Cart SET Reservations = ?, Allergies = ?, Requests = ? WHERE Cart_ID = ?`;
    db.run(query, [Reservations, Allergies, Requests, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// DELETE: Elimina un carrello
app.delete('/cart/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Cart WHERE Cart_ID = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

//Reservations CRUD
// CREATE: Aggiungi una nuova prenotazione
app.post('/reservations', (req, res) => {
    const { User_ID, Bags, Timestamp, Status } = req.body;
    const query = `INSERT INTO Reservations (User_ID, Bags, Timestamp, Status) VALUES (?, ?, ?, ?)`;
    db.run(query, [User_ID, Bags, Timestamp, Status], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// READ: Ottieni tutte le prenotazioni
app.get('/reservations', (req, res) => {
    const query = `SELECT * FROM Reservations`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE: Modifica lo stato di una prenotazione
app.put('/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { Status } = req.body;
    const query = `UPDATE Reservations SET Status = ? WHERE Res_ID = ?`;
    db.run(query, [Status, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// DELETE: Elimina una prenotazione
app.delete('/reservations/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Reservations WHERE Res_ID = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});


//Establishment CRUD
// CREATE: Aggiungi un nuovo stabilimento
app.post('/establishments', (req, res) => {
    const { Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags } = req.body;
    const query = `INSERT INTO Establishments (Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// READ: Ottieni tutti gli stabilimenti
app.get('/establishments', (req, res) => {
    const query = `SELECT * FROM Establishments`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE: Modifica un stabilimento
app.put('/establishments/:id', (req, res) => {
    const { id } = req.params;
    const { Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags } = req.body;
    const query = `UPDATE Establishments SET Name_Est = ?, Address = ?, Telephone = ?, Food_Category = ?, Type_Of_Est = ?, AvailableBags = ?, ReservedBags = ? WHERE Est_ID = ?`;
    db.run(query, [Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

// DELETE: Elimina uno stabilimento
app.delete('/establishments/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Establishments WHERE Est_ID = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

//lancio del server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});

// Middleware per la gestione degli errori
function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
}

// Aggiungi il middleware all'app
app.use(errorHandler);

