import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserShoppingCart, addBagToCart } from '../../API.mjs';

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
      // Recupera l'ID utente dal localStorage o da una fonte sicura
      const userId = localStorage.getItem('userId') || 1;
      
      // Controlla se c'è già un articolo dello stesso stabilimento nello stesso giorno
      // Aggiungi controlli di sicurezza per evitare errori con proprietà undefined
      const sameEstablishmentSameDay = cartItems.find(cartItem => {
        // Verifica che entrambi gli oggetti abbiano le proprietà necessarie
        if (!cartItem.establishment || !item.establishment) {
          return false;
        }
        
        if (!cartItem.pickupTimeRange || !item.pickupTimeRange) {
          return false;
        }
        
        // Verifica che i nomi degli stabilimenti corrispondano
        const sameEstablishment = cartItem.establishment === item.establishment;
        
        // Estrai le date dalle stringhe di intervallo di tempo in modo sicuro
        let cartItemDate = '';
        let itemDate = '';
        
        try {
          cartItemDate = cartItem.pickupTimeRange.split(' ')[0];
        } catch (e) {
          console.error("Error parsing cartItem pickup time:", e);
        }
        
        try {
          itemDate = item.pickupTimeRange.split(' ')[0];
        } catch (e) {
          console.error("Error parsing item pickup time:", e);
        }
        
        // Verifica che le date corrispondano
        const sameDay = cartItemDate && itemDate && cartItemDate === itemDate;
        
        return sameEstablishment && sameDay;
      });
      
      if (sameEstablishmentSameDay) {
        alert("You can only add one bag per establishment per day");
        return;
      }
      
      // Chiama l'API per aggiungere l'articolo al carrello dell'utente
      await addBagToCart(userId, item.id || item.bagId);
      
      // Ricarica i dati del carrello dal server dopo l'aggiunta
      await fetchCartData();
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