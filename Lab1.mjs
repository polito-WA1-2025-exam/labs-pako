
import dayjs from 'dayjs'
const pantry={
 TotalFood:[],
 add : function(Food_Name,Quantity){
    const cibo= new Food(Food_Name,Quantity);
    this.TotalFood.push(cibo);

 },
 showFood: function () {
    console.log(this.TotalFood);
}
}

function Food(Food_Name,Quantity){
    this.Food_Name=Food_Name;
    this.Quantity=Quantity;
}
const Bags={
  content:[],
  Borse:[],
  add : function(Bag_ID,Type,Content,Price,Size,Establishment_ID,TimeRange,State,UserID){
    const bag=new Bag(Bag_ID,Type,Content,Price,Size,Establishment_ID,TimeRange,State,UserID);
    if(bag.Type==="Regular"){
        this.content.push(Content);
       
    }else{
        this.content.push(null);
    }
    this.Borse.push(bag);
    },
 showBagContent: function(){
        console.log(this.content);
    },
showBag: function(){
    console.log(this.Borse);
}
  }


//finora bene , aggiustare qui
function Bag(Bag_ID,Type,Content,Price,Size,Establishment_ID,TimeRange,State,UserID){
    this.Bag_ID=Bag_ID;
    this.Type=Type;
    this.Content=Content;
    this.Price=Price;
    this.Size=Size;
    this.Establishment_ID=Establishment_ID;
    this.TimeRange=TimeRange;
    this.State=State;
    this.UserID=UserID;
   
}



// lui pure bene
function EstablishMent(Est_ID,Name_Est,Address,Telephone,Food_Category,Type_Of_Est,AvailableBags,ReservedBags){
    
    this.Est_ID=Est_ID;
    this.Name_Est=Name_Est;
    this.Address=Address;
    this.Telephone=Telephone;
    this.Food_Category=Food_Category;
    this.Type_Of_Est=Type_Of_Est;
    this.AvailableBags=AvailableBags;
    this.ReservedBags=ReservedBags;
    // non completamente finito
}

const Website = {
    Stores: [],
    Restaurants: [],
    List: [],

    add: function (Est_ID, Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags) {
        const Estab = new EstablishMent(Est_ID, Name_Est, Address, Telephone, Food_Category, Type_Of_Est, AvailableBags, ReservedBags);

        if (Estab.Type_Of_Est === 'Store') {
            let index = this.Stores.findIndex(e => e.Name_Est.localeCompare(Estab.Name_Est) > 0);
            if (index === -1) {
                this.Stores.push(Estab);
            } else {
                this.Stores.splice(index, 0, Estab);
            }
        } else if (Estab.Type_Of_Est === 'Restaurant') {
            let index = this.Restaurants.findIndex(e => e.Name_Est.localeCompare(Estab.Name_Est) > 0);
            if (index === -1) {
                this.Restaurants.push(Estab);
            } else {
                this.Restaurants.splice(index, 0, Estab);
            }
        }

        // Inserimento ordinato nella lista globale
        let index = this.List.findIndex(e => e.Name_Est.localeCompare(Estab.Name_Est) > 0);
        if (index === -1) {
            this.List.push(Estab);
        } else {
            this.List.splice(index, 0, Estab);
        }
    },

    showStores: function () {
        console.log(this.Stores);
    },

    showRestaurants: function () {
        console.log(this.Restaurants);
    },

    showList: function () {
        console.log(this.List);
    }
};

function ShoppingCart(Cart_ID,User_ID,Reservations,Allergies,Requests){
    this.Cart_ID=Cart_ID;
    this.User_ID=User_ID;
    this.Reservations=Reservations;
    this.Allergies=Allergies;
    this.Requests=Requests;
}
 const Cart={
    Carrello:[],
    add:function(Cart_ID,User_ID,Reservations,Allergies,Requests){
        const index = this.Carrello.findIndex(cart => cart.Cart_ID === Cart_ID && cart.User_ID === User_ID);
        if(index>=0){
            this.Carrello[index].Reservations.push(...Reservations)
        }else{
        const carrello=new ShoppingCart(Cart_ID,User_ID,Reservations,Allergies,Requests);
        this.Carrello.push(carrello);
        }
    },
    showCart : function(){
        console.log(this.Carrello);
    }
 }

 function Reservation(Res_ID,User_ID,Bags,Timestamp,Status){
    this.Res_ID=Res_ID;
    this.User_ID=User_ID;
    this.Bags=Bags;
    this.Timestamp=Timestamp;
    this.Status=Status;
 }

 const Reservations={
    Prenotazioni:[],
    add:function(Res_ID,User_ID,Bags,Timestamp,Status){
        const prenotazione=new Reservation(Res_ID,User_ID,Bags,Timestamp,Status);
        this.Prenotazioni.push(prenotazione);
    },
    showReservations: function(){
        console.log(this.Prenotazioni);
    }
 }
 function initializeData() {
    // Caso food
    pantry.add('Tomato', 10);
    pantry.add('Banana', 6);
    pantry.add('Strawberry', 9);
    pantry.add('kiwi', 2);
    pantry.add('Spaghetti', 12);

    // Caso establishments
    Website.add(1, "Pasta House", "Via Roma 10", "0123456789", "Italian", "Restaurant", 5, 2);
    Website.add(2, "Green Market", "Corso Milano 25", "0987654321", "Organic", "Store", 8, 3);
    Website.add(3, "Burger King", "Piazza Venezia 5", "0112233445", "Fast Food", "Restaurant", 10, 4);
    Website.add(4, "Eco Grocery", "Via Torino 33", "0556677889", "Vegan", "Store", 7, 1);
    Website.add(5, "Sushi World", "Viale Napoli 12", "0667788990", "Japanese", "Restaurant", 6, 2);

    // Caso bag
    Bags.add(1, "Regular", ["Pasta", "Pane", "Latte"], 10.99, "Medium", 101, "12:00-14:00", "Available", null);
    Bags.add(2, "Regular", "Riso", 5.99, "Small", 102, "15:00-17:00", "Available", null);
    Bags.add(3, "Surprise", ["Frutta", "Yogurt"], 8.50, "Large", 103, "18:00-20:00", "Reserved", 503);
    Bags.add(4, "Regular", ["Pomodori", "Mozzarella", "Basilico"], 7.49, "Medium", 104, "09:00-11:00", "Available", null);
    Bags.add(5, "Surprise", "Dolci", 12.99, "Large", 105, "20:00-22:00", "Reserved", 505);

    // Aggiunta carrelli
    Cart.add(1, 101, ["Bag1", "Bag2"], ["Glutine"], ["Consegna veloce"]);
    Cart.add(2, 102, ["Bag3"], ["Lattosio"], ["Lasciare alla reception"]);
    Cart.add(3, 103, ["Bag4", "Bag5"], [], ["Consegna dopo le 18:00"]);
    Cart.add(4, 104, ["Bag6"], ["Frutta a guscio"], []);
    Cart.add(1, 101, ["Bag7"]);

    // Aggiunta prenotazioni
    Reservations.add(1, 101, [11, 12], "2025-03-06T12:00:00Z", "Active");
    Reservations.add(2, 102, [15], "2025-03-06T13:30:00Z", "Cancelled");
    Reservations.add(3, 103, [20, 21, 22], "2025-03-06T14:45:00Z", "Active");
    Reservations.add(4, 104, [25], "2025-03-06T16:00:00Z", "Cancelled");
    Reservations.add(5, 105, [30, 31], "2025-03-06T18:15:00Z", "Active");
}

function showData() {
    pantry.showFood();
    Website.showStores();
    Bags.showBag();
    Cart.showCart();
    Reservations.showReservations();
}

// Esegui le funzioni
initializeData();
showData();

// LAB 2
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Abilita modalità verbose per il debug
sqlite3.verbose();

// Funzione per aprire la connessione al database
async function openDb() {
    return await open({
        filename: 'Database.db', // Modifica con il tuo nome di file se diverso
        driver: sqlite3.Database
    });
}

// Funzione per recuperare tutti gli oggetti dalla tabella "Bags"
async function getAllBags() {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Bags');
    return rows; // Restituisce tutte le righe come array di oggetti
}

// Funzione per recuperare gli oggetti che soddisfano una condizione (esempio: tutte le borse con "State" uguale a "Available")
async function getBagsByState(state) {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Bags WHERE State = ?', [state]);
    return rows; // Restituisce le righe che corrispondono alla condizione
}

async function getAllFood() {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Food'); // Assicurati che la tabella Food esista nel tuo DB
    return rows; // Restituisce tutte le righe come array di oggetti
}

// Funzione per recuperare tutti gli oggetti con una condizione specifica dalla tabella "Food" (esempio: per nome di cibo)
async function getFoodByName(foodName) {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Food WHERE Food_Name LIKE ?', [`%${foodName}%`]);
    return rows; // Restituisce tutte le righe che corrispondono al nome di cibo
}
// Funzione per recuperare tutti gli oggetti dalla tabella "Cart"
async function getAllCarts() {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Cart'); // Assicurati che la tabella Cart esista nel tuo DB
    return rows; // Restituisce tutte le righe come array di oggetti
}

// Funzione per recuperare gli oggetti che soddisfano una condizione (esempio: per un User_ID specifico)
async function getCartByUserID(userID) {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Cart WHERE User_ID = ?', [userID]);
    return rows; // Restituisce le righe che corrispondono al User_ID
}
// Funzione per recuperare tutte le prenotazioni
async function getAllReservations() {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Reservations'); // Assicurati che la tabella Reservations esista nel tuo DB
    return rows; // Restituisce tutte le righe come array di oggetti
}

// Funzione per recuperare le prenotazioni per stato (esempio: "Active" o "Cancelled")
async function getReservationsByStatus(status) {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Reservations WHERE Status = ?', [status]);
    return rows; // Restituisce le righe che corrispondono allo stato
}
// Funzione per recuperare tutti gli oggetti dalla tabella "Establishment"
async function getAllEstablishments() {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Establishments'); // Assicurati che la tabella Establishments esista nel tuo DB
    return rows; // Restituisce tutte le righe come array di oggetti
}

// Funzione per recuperare gli stabilimenti di un tipo specifico (esempio: "Restaurant" o "Store")
async function getEstablishmentsByType(type) {
    const db = await openDb();
    const rows = await db.all('SELECT * FROM Establishments WHERE Type_Of_Est = ?', [type]);
    return rows; // Restituisce le righe che corrispondono al tipo di stabilimento
}
async function showData() {
    // Mostra tutti gli alimenti
    const allFood = await getAllFood();
    console.log('All Food:', allFood);

    // Mostra gli alimenti che contengono "Tomato" nel nome
    const foodByName = await getFoodByName('Tomato');
    console.log('Food containing "Tomato":', foodByName);

    // Mostra tutte le borse
    const allBags = await getAllBags();
    console.log('All Bags:', allBags);

    // Mostra le borse disponibili
    const availableBags = await getBagsByState('Available');
    console.log('Available Bags:', availableBags);

    // Mostra le borse di tipo "Regular"
    const regularBags = await getBagsByType('Regular');
    console.log('Regular Bags:', regularBags);

    // Mostra le borse di tipo "Surprise"
    const surpriseBags = await getBagsByType('Surprise');
    console.log('Surprise Bags:', surpriseBags);

    // Mostra tutti i carrelli
    const allCarts = await getAllCarts();
    console.log('All Carts:', allCarts);

    // Mostra i carrelli di un determinato utente (esempio User_ID = 101)
    const cartByUser = await getCartByUserID(101);
    console.log('Cart for User 101:', cartByUser);

    // Mostra tutte le prenotazioni
    const allReservations = await getAllReservations();
    console.log('All Reservations:', allReservations);

    // Mostra le prenotazioni "Active"
    const activeReservations = await getReservationsByStatus('Active');
    console.log('Active Reservations:', activeReservations);

    // Mostra tutti gli stabilimenti
    const allEstablishments = await getAllEstablishments();
    console.log('All Establishments:', allEstablishments);

    // Mostra solo i ristoranti
    const restaurants = await getEstablishmentsByType('Restaurant');
    console.log('Restaurants:', restaurants);
}
showData();