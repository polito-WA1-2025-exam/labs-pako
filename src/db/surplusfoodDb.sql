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

CREATE TABLE RemovedItems (
    RemovedItemID INTEGER PRIMARY KEY AUTOINCREMENT,
    TimeStamp DATETIME PRIMARY KEY  DEFAULT CURRENT_TIMESTAMP,
    Quantity INTEGER,
    BagID INTEGER,
    FOREIGN KEY (BagID) REFERENCES Bag(BagID)
)

CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
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
INSERT INTO User (Username, Email) VALUES 
('john_doe', 'john.doe@example.com'),
('jane_smith', 'jane.smith@example.com'),
('alice_wong', 'alice.wong@example.com');

INSERT INTO Establishment (Name, Address, PhoneNumber, Category, Type) VALUES 
('Green Grocers', '123 Main St, Springfield', '555-1234', 'Grocery', 'Supermarket'),
('Fresh Mart', '456 Elm St, Springfield', '555-5678', 'Grocery', 'Convenience Store'),
('Organic Heaven', '789 Oak St, Springfield', '555-9101', 'Grocery', 'Organic Store');

INSERT INTO FoodItem (Name, Quantity) VALUES 
('Apple', 50),
('Banana', 100),
('Bread', 30),
('Milk', 20),
('Eggs', 60);

INSERT INTO Bag (Type, Size, Content, Price, State, UserID, EstablishmentID, TimeToPickUp) VALUES 
('Regular', 'Medium', 'Fruits', 10.99, 'available', 1, 1, '2023-10-15 12:00:00'),
('Surprise', 'Large', 'Groceries', 15.99, 'reserved', 2, 2, '2023-10-16 14:00:00'),
('Regular', 'Small', 'Snacks', 5.99, 'available', 3, 3, '2023-10-17 10:00:00');

INSERT INTO BagFoodItem (BagID, FoodItemID, Quantity) VALUES 
(1, 1, 5),  -- 5 Apples in Bag 1
(1, 2, 10), -- 10 Bananas in Bag 1
(2, 3, 2),  -- 2 Breads in Bag 2
(2, 4, 1),  -- 1 Milk in Bag 2
(3, 5, 12); -- 12 Eggs in Bag 3

INSERT INTO RemovedItems (Quantity, BagID) VALUES 
(2, 1),  -- 2 items removed from Bag 1
(1, 2);  -- 1 item removed from Bag 2

INSERT INTO Reservation (BagID, UserID) VALUES 
(1, 1),  -- User 1 reserves Bag 1
(2, 2),  -- User 2 reserves Bag 2
(3, 3);  -- User 3 reserves Bag 3

INSERT INTO ShoppingCart (ReservationID, Allergies, Requests, UserID) VALUES 
(1, 'None', 'Please pack carefully', 1),
(2, 'Lactose Intolerant', 'No dairy products', 2),
(3, 'Nut Allergy', 'No nuts in the bag', 3);