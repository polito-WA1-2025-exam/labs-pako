import React, { useState } from "react";
import CartItem from "./CartItem";
import AllergiesForm from "./AllergiesForm";

const ShoppingCart = () => {  
  // Stato per gli articoli del carrello
  const [cartItems, setCartItems] = useState([]);
  
  // Stato per le allergie e richieste speciali
  const [allergies, setAllergies] = useState('');

  // Calcola il totale del carrello
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Funzione per aggiungere un sacchetto al carrello
  const addToCart = (bag) => {
    setCartItems([...cartItems, bag]);
  };

  // Funzione per rimuovere un sacchetto dal carrello
  const removeFromCart = (bagId) => {
    setCartItems(cartItems.filter(item => item.id !== bagId));
  };

  return (
    <div className="shopping-cart p-4">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
          <p>Your cart is empty</p>
          <a href="/bags" className="btn btn-primary">
            Browse Food Bags
          </a>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onRemove={() => removeFromCart(item.id)} 
              />
            ))}
          </div>
          <AllergiesForm 
            allergies={allergies} 
            setAllergies={setAllergies} 
          />
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cartItems.length}):</span>
                <span>€{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>€{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-success w-100 mt-3">
            <i className="bi bi-check-circle"></i> Confirm Order
          </button>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
