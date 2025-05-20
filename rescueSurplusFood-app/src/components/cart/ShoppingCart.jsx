import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserShoppingCart } from '../../API.mjs';

const ShoppingCart = () => {  
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [removedItems, setRemovedItems] = useState({});
  const [unavailableItems, setUnavailableItems] = useState([]);
  
  // Carica i dati del carrello dell'utente dal server
  useEffect(() => {
    const fetchCartData = async () => {
      if (!isLoggedIn) {
        setCartItems([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Recupera l'ID utente dal localStorage o da un'altra fonte
        // Per semplicità, qui supponiamo di avere l'ID utente 1 quando l'utente è loggato
        const userId = localStorage.getItem('userId') || 1;
        
        // Ottieni i dati del carrello dell'utente dal server
        const cartData = await getUserShoppingCart(userId);
        
        // Trasforma i dati nel formato corretto per il componente
        if (cartData && cartData.items) {
          setCartItems(cartData.items);
        } else {
          setCartItems([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shopping cart:", error);
        setError("Si è verificato un errore durante il caricamento del carrello. Riprova più tardi.");
        setLoading(false);
      }
    };
    
    fetchCartData();
  }, [isLoggedIn]);
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };
  
  const getStatusBadgeVariant = (status) => {
    return status === 'available' ? 'success' : 'warning';
  };
  
  const handleRemoveItem = (bagId, contentIndex) => {
    setRemovedItems((prev) => {
      const removedCount = prev[bagId]?.length || 0;
      if (removedCount >= 2) return prev; 
      return {
        ...prev,
        [bagId]: [...(prev[bagId] || []), contentIndex]
      };
    });
  };
  
  const removeFromCart = async (bagId) => {
    try {
      // Qui dovresti chiamare l'API per rimuovere l'articolo dal carrello
      // Per ora, simuliamo la rimozione aggiornando lo stato locale
      
      // In un'implementazione reale:
      // await removeItemFromCart(userId, bagId);
      
      setCartItems(cartItems.filter(item => item.id !== bagId));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Mostra un messaggio di errore all'utente
    }
  };
  
  const clearCart = async () => {
    try {
      // Qui dovresti chiamare l'API per svuotare il carrello
      // In un'implementazione reale:
      // const userId = localStorage.getItem('userId') || 1;
      // await clearUserCart(userId);
      
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Mostra un messaggio di errore all'utente
    }
  };
  
  const handleConfirmOrder = async () => {
    try {
      // Qui dovresti chiamare l'API per confermare l'ordine
      // In un'implementazione reale:
      // const userId = localStorage.getItem('userId') || 1;
      // const orderData = {
      //   userId,
      //   items: cartItems.map(item => item.id),
      //   allergies,
      //   specialRequests
      // };
      // const response = await confirmOrder(orderData);
      
      // Simuliamo la risposta del server con alcuni articoli non disponibili
      const simulateUnavailable = cartItems.filter(() => Math.random() < 0.3); // 30% chance
      
      if (simulateUnavailable.length > 0) {
        // Alcuni articoli non sono più disponibili
        setUnavailableItems(simulateUnavailable.map(item => item.id));
        setTimeout(() => {
          setUnavailableItems([]);
        }, 5000);
        alert("Problem with the order! Some items are no longer available.");
      } else {
        // Tutti gli articoli sono disponibili, conferma l'ordine
        alert("Order Confirmed!");
        clearCart();
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      // Mostra un messaggio di errore all'utente
    }
  };
  
  // Helper function to safely capitalize a string
  const capitalizeString = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  return (
    <div className="shopping-cart p-4">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your shopping cart...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
          <p>Your cart is empty</p>
          <a href="/bags" className="btn btn-primary">Browse Food Bags</a>
        </div>
      ) : (
        <>
          <div className="cart-items mb-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${index}`} className={`mb-3 ${unavailableItems.includes(item.id) ? 'bg-danger text-white' : ''}`}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge bg="primary" className="me-1">
                      {capitalizeString(item.type)}
                    </Badge>
                    <Badge bg="secondary">
                      {typeof item.size === 'string' ? capitalizeString(item.size) : String(item.size)}
                    </Badge>
                  </div>
                  <Badge bg={getStatusBadgeVariant(item.status)}>
                    {item.status === 'available' ? 'Available' : 'Reserved'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="mb-3">{item.establishment}</Card.Title>
                  <div className="mb-2">
                    <i className="bi bi-clock me-2"></i>
                    <span>Pickup: {item.pickupTimeRange}</span>
                  </div>
                  <div className="mb-3">
                    <i className="bi bi-tag me-2"></i>
                    <span className="fw-bold">€{item.price.toFixed(2)}</span>
                  </div>
                  {item.contents && item.type && item.type.toLowerCase() === 'regular' && (
                    <div className="mb-3">
                      <strong>Contents:</strong>
                      <ul>
                        {item.contents.map((content, idx) => (
                          !removedItems[item.id]?.includes(idx) && (
                            <li key={idx}>
                              {content.quantity} x {content.item} 
                              {(removedItems[item.id]?.length || 0) < 2 && (
                                <Button 
                                  variant="outline-danger" 
                                  size="sm" 
                                  className="ms-2"
                                  onClick={() => handleRemoveItem(item.id, idx)}
                                >
                                  Remove
                                </Button>
                              )}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button variant="danger" onClick={() => removeFromCart(item.id)}>
                    Remove from Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
          
          {/* Order Summary Section */}
          <Card className="mt-4 shadow-sm border-light">
            <Card.Body>
              <h3 className="mb-4">Order Summary</h3>
              <Row className="mb-2">
                <Col sm={6}><span>Items ({cartItems.length}):</span></Col>
                <Col sm={6} className="text-end"><span>€{calculateTotal().toFixed(2)}</span></Col>
              </Row>
              <Row className="mb-2">
                <Col sm={6}><strong>Total:</strong></Col>
                <Col sm={6} className="text-end"><strong>€{calculateTotal().toFixed(2)}</strong></Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Allergies:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Specify any allergies"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Special Requests:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Specify any special requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </Form.Group>
              <Button 
                variant="success" 
                className="w-100" 
                onClick={handleConfirmOrder}
                disabled={cartItems.length === 0}
              >
                <i className="bi bi-check-circle"></i> Confirm Order
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;