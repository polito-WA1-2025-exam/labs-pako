-- database: :memory:
-- Init Tables
CREATE TABLE FoodItem (
    FoodItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Quantity INTEGER DEFAULT 0,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- I use bagFoodItem as bridge between FoodItem and Bag for many to many relation
CREATE TABLE BagFoodItem (
    BagID INTEGER,
    FoodItemID INTEGER,
    Quantity INTEGER,
    PRIMARY KEY (BagID, FoodItemID),
    FOREIGN KEY (BagID) REFERENCES Bag(BagID),
    FOREIGN KEY (FoodItemID) REFERENCES FoodItem(FoodItemID)
);

CREATE TABLE Bag (
    BagID INTEGER PRIMARY KEY AUTOINCREMENT,
    Type TEXT NOT NULL,
    Size TEXT,
    Content TEXT,
    Price REAL,
    State TEXT DEFAULT 'available',
    UserID INTEGER,
    EstablishmentID INTEGER,
    TimeToPickUp DATETIME,
    RemovedItems TEXT,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (EstablishmentID) REFERENCES Establishment(EstablishmentID)
);

CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Establishment (
    EstablishmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Address TEXT NOT NULL,
    PhoneNumber TEXT,
    Category TEXT,
    Type TEXT,
    Content TEXT,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reservation (
    ReservationID INTEGER PRIMARY KEY AUTOINCREMENT,
    Content TEXT,
    TimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT DEFAULT 'pending',
    UserID INTEGER,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE ShoppingCart (
    ShoppingCartID INTEGER PRIMARY KEY AUTOINCREMENT,
    Reservations TEXT,
    Allergies TEXT,
    Requests TEXT,
    UserID INTEGER UNIQUE,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- -------------Insert Example Data (check if it make sense)----------------------
-- Users
INSERT INTO User (Username, Email) VALUES ('john_doe', 'john@example.com');
INSERT INTO User (Username, Email) VALUES ('jane_smith', 'jane@example.com');

-- Establishments
INSERT INTO Establishment (Name, Address, PhoneNumber, Category, Type, Content)
VALUES ('Green Bistro', '123 Main St', '555-1234', 'Restaurant', 'Vegetarian', 'Organic and vegan options');

INSERT INTO Establishment (Name, Address, PhoneNumber, Category, Type, Content)
VALUES ('Fresh Mart', '456 Elm St', '555-5678', 'Supermarket', 'General', 'Fresh produce and groceries');

-- Food Items
INSERT INTO FoodItem (Name, Quantity) VALUES ('Apple', 50);
INSERT INTO FoodItem (Name, Quantity) VALUES ('Banana', 30);
INSERT INTO FoodItem (Name, Quantity) VALUES ('Carrot', 20);

-- Bags
INSERT INTO Bag (Type, Size, Content, Price, UserID, EstablishmentID, TimeToPickUp)
VALUES ('Regular', 'Medium', 'Fruits and vegetables', 15.99, 1, 1, '2023-12-01 18:00:00');

INSERT INTO Bag (Type, Size, Content, Price, UserID, EstablishmentID, TimeToPickUp)
VALUES ('Surprise', 'Small', 'Snacks', 9.99, 2, 2, '2023-12-02 12:00:00');

-- Bag-FoodItem Relationships
INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES (1, 1, 5); -- 5 Apples in Bag 1
INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES (1, 2, 3); -- 3 Bananas in Bag 1
INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES (2, 3, 10); -- 10 Carrots in Bag 2

-- Reservations
INSERT INTO Reservation (Content, UserID) VALUES ('Reservation for Bag 1', 1);
INSERT INTO Reservation (Content, UserID) VALUES ('Reservation for Bag 2', 2);

-- Shopping Carts
INSERT INTO ShoppingCart (Reservations, Allergies, Requests, UserID)
VALUES ('1,2', 'None', 'No special requests', 1);

INSERT INTO ShoppingCart (Reservations, Allergies, Requests, UserID)
VALUES ('2', 'Peanuts', 'Please pack separately', 2);

-- Query Examples
-- List all bags with their associated food items
SELECT b.BagID, b.Type, b.Content, f.Name AS FoodItem, bf.Quantity
FROM Bag b
JOIN BagFoodItem bf ON b.BagID = bf.BagID
JOIN FoodItem f ON bf.FoodItemID = f.FoodItemID;

-- List all reservations with user details
SELECT r.ReservationID, r.Content, r.Status, u.Username, u.Email
FROM Reservation r
JOIN User u ON r.UserID = u.UserID;

-- List all shopping carts with user details
SELECT sc.ShoppingCartID, sc.Reservations, sc.Allergies, sc.Requests, u.Username
FROM ShoppingCart sc
JOIN User u ON sc.UserID = u.UserID;
