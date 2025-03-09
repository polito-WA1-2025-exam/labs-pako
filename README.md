# Table of contents

<!-- TOC -->

- [Table of contents](#table-of-contents)
- [Group "PAKO"](#group-pako)
    - [Members](#members)
- [Exercise "Rescuing Surplus Food"](#exercise-rescuing-surplus-food)
- [Prerequisites](#prerequisites)
    - [Dependencies](#dependencies)
- [Project Structure](#project-structure)
    - [Folder and File Descriptions](#folder-and-file-descriptions)
- [Lab Journal](#lab-journal)
    - [Lab 1](#lab-1)
        - [Objects and Properties](#objects-and-properties)
            - [FoodItem](#fooditem)
            - [Bag](#bag)
            - [Establishment](#establishment)
            - [ShoppingCart](#shoppingcart)
            - [Reservation](#reservation)
        - [Relationships](#relationships)

<!-- /TOC -->

# Group "PAKO"

## Members
- s337165 Simone Pio Candido
- s348016 Lucio Fuoco
- s346267 Emre Elçi
- s336914 Giovanni Martinese
- 

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

# Project Structure

The project structure is organized as follows:

```
node_modules/                # Installed modules via npm
src/                         # Main source code directory
│
├── models/                  # Domain models
│   ├── Bag.mjs              # Bag model
│   ├── BagCollection.mjs    # Bag collection
│   ├── Establishment.mjs    # Establishment model
│   ├── EstablishmentCollection.mjs  # Establishment collection
│   ├── FoodItem.mjs         # Food item model
│   ├── FoodItemCollection.mjs    # Food item collection
│   ├── Reservation.mjs      # Reservation model
│   ├── ReservationCollection.mjs   # Reservation collection
│   ├── ShoppingCart.mjs     # Shopping cart model
│   ├── User.mjs             # User model
│   └── UserCollection.mjs   # User collection
│
├── services/                # Project services
│   └── dataService.mjs      # Data handling service
│
├── index.mjs                # Main entry point of the application
│
.gitignore                   # Git ignore file
package-lock.json            # npm lock file
package.json                 # npm configuration file
README.md                   # This file, describing the project
```

## Folder and File Descriptions

- **`src/models/`**: Contains domain models, each representing an entity in the system (e.g., `Bag`, `Establishment`, `Reservation`).
  
- **`src/services/`**: Contains services handling business logic and data interaction (e.g., `dataService.mjs`).

- **`src/index.mjs`**: The main entry point of the application, where the process is initiated.

- **`package.json`**: Contains project configuration, including dependencies and scripts.

- **`package-lock.json`**: Manages precise versions of dependencies to ensure consistency across environments.

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
- `reservations`: List of selected `Reservation` objects
- `allergies`: Optional text field for allergies  
- `requests`: Optional text field for special requests  

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
- **One `ShoppingCart` contains multiple `Reservations`.**  
- **One `User` can have multiple `Reservations`.**  
- **One `Reservation` links one `User` to one `Bag`.**  
