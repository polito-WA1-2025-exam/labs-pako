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
-- TODO: Remember food item FK in RemovedItems (bagFoodItem)
CREATE TABLE Bag (
    BagID INTEGER PRIMARY KEY,
    RemovedItems TEXT,
    Price REAL,
    State TEXT DEFAULT 'available',
    UserID INTEGER,
    EstablishmentID INTEGER,
    TimeToPickUp DATETIME,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (EstablishmentID) REFERENCES Establishment(EstablishmentID)
);

CREATE TABLE RemovedItems (
    RemovedItemID INTEGER,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Quantity INTEGER,
    BagID INTEGER,
    PRIMARY KEY (RemovedItemID, CreationDate),
    FOREIGN KEY (BagID) REFERENCES Bag(BagID)
);

CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    -- TODO: add password?
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Todo contet should be more a collection of bag IDs
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
    TimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status TEXT DEFAULT 'reserverd',
    BagID INTEGER,
    UserID INTEGER,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BagID) REFERENCES Bag(BagID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE ShoppingCart (
    ShoppingCartID INTEGER PRIMARY KEY AUTOINCREMENT,
    ReservationID INTEGER,
    Allergies TEXT,
    Requests TEXT,
    UserID INTEGER UNIQUE,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID)
);

-- -------------Insert Example Data (check if it make sense)----------------------
-- Insert into User Table
INSERT INTO User (Username, Email) VALUES 
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('alice_wong', 'alice.wong@example.com');

-- Insert into Establishment Table
INSERT INTO Establishment (Name, Address, PhoneNumber, Category, Type) VALUES 
('Green Grocers', '123 Main St, Springfield', '555-1234', 'Grocery', 'Supermarket'),
('Fresh Mart', '456 Elm St, Springfield', '555-5678', 'Grocery', 'Convenience Store'),
('Organic Heaven', '789 Oak St, Springfield', '555-9101', 'Grocery', 'Organic Store');

-- Insert into FoodItem Table
INSERT INTO FoodItem (Name, Quantity) VALUES 
('Apple', 50),
('Banana', 100),
('Bread', 30),
('Milk', 20),
('Eggs', 60);

-- Insert into Bag Table
INSERT INTO Bag (BagID, RemovedItems, Price, State, UserID, EstablishmentID, TimeToPickUp) VALUES 
(1, 'None', 10.99, 'available', 1, 1, '2023-10-15 12:00:00'),
(2, 'None', 15.99, 'reserved', 2, 2, '2023-10-16 14:00:00'),
(3, 'None', 5.99, 'available', 3, 3, '2023-10-17 10:00:00');

-- Insert into BagFoodItem Table
INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES 
(1, 1, 5),  -- 5 Apples in Bag 1
(1, 2, 10), -- 10 Bananas in Bag 1
(2, 3, 2),  -- 2 Breads in Bag 2
(2, 4, 1),  -- 1 Milk in Bag 2
(3, 5, 12); -- 12 Eggs in Bag 3

-- Insert into RemovedItems Table
INSERT INTO RemovedItems (RemovedItemID, Quantity, BagID) VALUES 
(1, 2, 1),  -- 2 items removed from Bag 1
(2, 1, 2);  -- 1 item removed from Bag 2

-- Insert into Reservation Table
INSERT INTO Reservation (BagID, UserID) VALUES 
(1, 1),  -- User 1 reserves Bag 1
(2, 2),  -- User 2 reserves Bag 2
(3, 3);  -- User 3 reserves Bag 3

-- Insert into ShoppingCart Table
INSERT INTO ShoppingCart (ReservationID, Allergies, Requests, UserID) VALUES 
(1, 'None', 'Please pack carefully', 1),
(2, 'Lactose Intolerant', 'No dairy products', 2),
(3, 'Nut Allergy', 'No nuts in the bag', 3);