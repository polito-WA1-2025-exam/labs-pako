# Table of contents
<!-- TOC -->

- [Group "PAKO"](#group-pako)
    - [Members](#members)
- [Exercise "Rescuing Surplus Food"](#exercise-rescuing-surplus-food)
- [Prerequisites](#prerequisites)
    - [Dependencies](#dependencies)
- [Lab Journal](#lab-journal)
    - [Lab 1](#lab-1)
        - [Objects and Properties](#objects-and-properties)
            - [FoodItem](#fooditem)
            - [Bag](#bag)
            - [Establishment](#establishment)
            - [ShoppingCart](#shoppingcart)
            - [User](#user)
            - [Reservation](#reservation)
        - [Relationships](#relationships)

<!-- /TOC -->

# Group "PAKO"

## Members
- s337165 Simone Pio Candido

# Exercise ["Rescuing Surplus Food"](https://polito-webapp1.github.io/lab-2025/Lab00/SurplusFood.pdf)

# Prerequisites

Before starting, ensure that Node.js is installed on your computer.  
If not, you can download version 22.x (LTS) from [Node.js official website](https://nodejs.org/en/).

## Dependencies
The project uses the following dependencies:
- [day.js](https://day.js.org/) - Used for date handling and formatting.

To install `day.js`, run:
```sh
npm init # if not already done
npm install dayjs
```

# Lab Journal

## [Lab 1](https://polito-webapp1.github.io/lab-2025/Lab01/Lab01.pdf)

The application is structured around the following main objects and their relationships:

### Objects and Properties

#### FoodItem
- `id`: Unique identifier  
- `name`: Name of the food item  
- `quantity`: Quantity of the item  

#### Bag
- `id`: Unique identifier  
- `type`: `"surprise"` or `"regular"`  
- `content`: List of `FoodItem` objects (only for regular bags)  
- `size`: `"small"`, `"medium"`, or `"large"`  
- `price`: Cost of the bag  
- `establishmentId`: Reference to the `Establishment` offering this bag  
- `timeToPickUp`: Pickup time range  
- `state`: `"available"` or `"reserved"`  
- `userId`: Nullable, references the `User` who reserved the bag  

#### Establishment
- `id`: Unique identifier  
- `name`: Name of the establishment  
- `address`: Physical location  
- `phoneNumber`: Contact number  
- `category`: Type of food/cuisine  
- `type`: `"store"` or `"restaurant"`  
- `bags`: List of `Bag` objects available at this establishment  

#### ShoppingCart
- `id`: Unique identifier  
- `userId`: References the `User` who owns the cart  
- `bags`: List of selected `Bag` objects (max 1 per establishment per day)  
- `allergies`: Optional text field for allergies  
- `requests`: Optional text field for special requests  

#### User
- `id`: Unique identifier  
- `name`: User's full name  
- `email`: Login email  
- `password`: Hashed password  
- `shoppingCart`: Reference to the `ShoppingCart`  
- `reservations`: List of `Reservation` objects  

#### Reservation
- `id`: Unique identifier  
- `userId`: References the `User` who made the reservation  
- `bags`: References the reserved `Bags`  
- `timestamp`: Time of reservation  
- `status`: `"active"` or `"canceled"`  

### Relationships
- **One `Establishment` has many `Bags`.**  
- **One `Bag` belongs to one `Establishment`.**  
- **One `Bag` (if reserved) belongs to one `User`.**  
- **One `User` has one `ShoppingCart`.**  
- **One `ShoppingCart` contains multiple `Bags` (max 1 per establishment per day).**  
- **One `User` can have multiple `Reservations`.**  
- **One `Reservation` links one `User` to one `Bag`.**  