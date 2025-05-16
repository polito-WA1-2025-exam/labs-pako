import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserShoppingCart } from '../../API.mjs';

// Crea il contesto
const CartContext = createContext();

// Hook personalizzato per accedere al contesto del carrello
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Funzione per recuperare i dati del carrello dal server
  const fetchCartData = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Recupera l'ID utente dal localStorage o da una fonte sicura
      const userId = localStorage.getItem('userId') || 1;
      
      // Chiama l'API per ottenere il carrello dell'utente
      const cartData = await getUserShoppingCart(userId);
      
      if (cartData && cartData.items) {
        setCartItems(cartData.items);
      } else {
        setCartItems([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shopping cart data:", error);
      setCartItems([]);
      setLoading(false);
    }
  };
  
  // Carica i dati del carrello all'avvio e quando cambia lo stato di login
  useEffect(() => {
    fetchCartData();
  }, [isLoggedIn]);
  
  // Funzione per aggiungere un articolo al carrello
  const addToCart = async (item) => {
    try {
      // In un'implementazione reale, chiameresti un'API per aggiungere l'articolo al carrello
      // const userId = localStorage.getItem('userId') || 1;
      // await addItemToCart(userId, item.id);
      
      // Per ora, aggiorna solo lo stato locale
      setCartItems(prevItems => {
        // Controlla se c'è già un articolo dello stesso stabilimento nello stesso giorno
        const sameEstablishmentSameDay = prevItems.find(
          cartItem => 
            cartItem.establishment === item.establishment && 
            cartItem.pickupTimeRange.split(' ')[0] === item.pickupTimeRange.split(' ')[0]
        );
        
        if (sameEstablishmentSameDay) {
          alert("You can only add one bag per establishment per day");
          return prevItems;
        }
        
        return [...prevItems, item];
      });
      
      // Ricarica i dati del carrello dal server dopo l'aggiunta
      // fetchCartData();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart");
    }
  };
  
  // Funzione per rimuovere un articolo dal carrello
  const removeFromCart = async (itemId) => {
    try {
      // In un'implementazione reale, chiameresti un'API per rimuovere l'articolo dal carrello
      // const userId = localStorage.getItem('userId') || 1;
      // await removeItemFromCart(userId, itemId);
      
      // Per ora, aggiorna solo lo stato locale
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      
      // Ricarica i dati del carrello dal server dopo la rimozione
      // fetchCartData();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart");
    }
  };
  
  // Funzione per svuotare il carrello
  const clearCart = async () => {
    try {
      // In un'implementazione reale, chiameresti un'API per svuotare il carrello
      // const userId = localStorage.getItem('userId') || 1;
      // await clearUserCart(userId);
      
      // Per ora, aggiorna solo lo stato locale
      setCartItems([]);
      
      // Ricarica i dati del carrello dal server dopo la pulizia
      // fetchCartData();
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };
  
  // Valore del contesto da fornire ai componenti figli
  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartData
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}