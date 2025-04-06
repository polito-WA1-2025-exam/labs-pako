# Group "PAKO-Lucio"

## Member
- s348016 Lucio Fuoco
# Exercise "Rescuing Surplus Food"

# Prerequisites
Before starting, ensure that Node.js is installed on your computer.
If not, you can download version 22.x (LTS) from Node.js official website.
# Dependencies

this project uses the following dependencies
-  **day.js** ,used for date handling and formatting
  To install 'day.js' ,run:
```sh
  npm init # if not already done 
  npm install dayjs
``` 
# Lab Journal
___
# Lab_1
here the following structure that I made reading the document:
- - -

### Food
- `Food_ID` 
- `Food_Name` 
- `Quantity` 
### Bag
- `Bag_ID`
- `Type_of_Bag` : `Surprise` or `Regular`
- `Content` : ONLY for regular bags
- `Price`
- `Size`: could be `Small`,`Medium`,`Large`
- `Establishment_ID`
- `Time_Range`
- `State` : `Available` or `Reserved`
- `UserID`: useful to see who reserved that bag
  
### Establishment
- `Est_ID`
- `Name_Est`
- `Address`
- `Telephone`
- `Food_Category`
- `Type_Of_Est` : `Store` or `Restaurant`
- `Available_Bags` : list of bags `Available`
- `Reserved_Bags`: list of bags `Reserved`

### ShoppingCart
- `Cart_ID`  
- `User_ID`
- `Reservations`
- `Allergies`: Optional text field for allergies  
- `Requests`: Optional text field for special requests  

### Reservation
- `Res_ID`  
- `User_ID`  
- `Bags`  
- `Timestamp`  
- `Status`: `"active"` or `"canceled"`

# Relations 
 - One `Establishment` has many `Bags`.
-  One `Bag` belongs to one `Establishment`.
- One `Bag` (if reserved) belongs to one `User`.  
- One `User` has one `ShoppingCart`.
- One `ShoppingCart` contains multiple `Reservations`. 
- One `User` can have multiple `Reservations`.
- One `Reservation` links one `User` to one `Bag`.  

# Lab 3
# API Documentation

Questa API consente di gestire diverse entità nel sistema, tra cui **Food**, **Bags**, **Cart**, **Reservations**, e **Establishments**. Supporta le operazioni CRUD (Create, Read, Update, Delete).

## Indice

1. [Food API](#food-api)
2. [Bags API](#bags-api)
3. [Cart API](#cart-api)
4. [Reservations API](#reservations-api)
5. [Establishments API](#establishments-api)

---

## Food API

La **Food API** consente di gestire gli alimenti nel sistema.

### [GET] /food

Restituisce una lista di tutti gli alimenti. È possibile filtrare per **quantità**.

**Query Parameters**:
- `quantity` (opzionale): Filtro per la quantità degli alimenti.

**Esempio di richiesta**:
```http
    GET /food?quantity=10
    Risposte:
    [
        { "id": 1, "Food_Name": "Apple", "Quantity": 10 }
    ]
    
    {
        "error": "Error message"
    }
```
### [GET] /food/:id
Restituisce un singolo alimento dato il suo ID.

**Esempio di richiesta**:
```http
GET /food/1
Risposte
{
    "id": 1,
    "Food_Name": "Apple",
    "Quantity": 10
}
```
e simili per altri casi.
Errori Comuni:
400 Bad Request: La richiesta è malformata o manca di parametri obbligatori.

404 Not Found: La risorsa non è stata trovata.

500 Internal Server Error: Errore interno del server.



