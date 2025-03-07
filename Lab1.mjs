
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
