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

