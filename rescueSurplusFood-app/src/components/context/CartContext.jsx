import React, { createContext, useState, useContext } from 'react';

// Crea il contesto per il carrello
const CartContext = createContext();

// Componente per fornire il contesto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Aggiungi un sacchetto al carrello
  const addToCart = (bag) => {
    setCartItems([...cartItems, bag]);
  };

  // Rimuovi un sacchetto dal carrello
  const removeFromCart = (bagId) => {
    setCartItems(cartItems.filter(item => item.id !== bagId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Funzione per usare il contesto nel componente
export const useCart = () => useContext(CartContext);
