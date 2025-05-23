import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserShoppingCart, removeBagFromCart } from '../../API.mjs';

const ShoppingCart = () => {  
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [removedItems, setRemovedItems] = useState({});
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [removingItems, setRemovingItems] = useState(new Set()); // Track items being removed
  const [successMessage, setSuccessMessage] = useState(''); // Success feedback
  
  // Load user's cart data from server
  const fetchCartData = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get user ID from localStorage or other source
      const userId = localStorage.getItem('userId') || 1;
      
      // Get user's cart data from server
      const cartData = await getUserShoppingCart(userId);
      
      // Transform data to correct format for component
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
  
  useEffect(() => {
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
    setLoading(true);
    setError(null);
    
    // Get user ID
    const userId = localStorage.getItem('userId') || 1;
    
    console.log(`Removing bag ${bagId} from cart for user ${userId}`);
    
    // Call the API to remove the bag from cart
    await removeBagFromCart(userId, bagId);
    
    // Update local state by filtering out the removed bag
    setCartItems(prevItems => prevItems.filter(item => item.id !== bagId));
    
    // Also remove from removedItems state if it exists
    setRemovedItems(prev => {
      const newRemovedItems = { ...prev };
      delete newRemovedItems[bagId];
      return newRemovedItems;
    });
    
    console.log(`Successfully removed bag ${bagId} from cart`);
    
  } catch (error) {
    console.error("Error removing item from cart:", error);
    setError(`Failed to remove item from cart: ${error.message}`);
    
    // Optionally show a user-friendly error message
    alert(`Error removing item: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
  
  const clearCart = async () => {
    try {
      setError(null);
      setSuccessMessage('');
      
      const userId = localStorage.getItem('userId') || 1;
      
      // Remove all items one by one
      const removePromises = cartItems.map(item => removeBagFromCart(userId, item.id));
      
      await Promise.all(removePromises);
      
      // Clear local state
      setCartItems([]);
      setSuccessMessage('Cart cleared successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(`Failed to clear cart: ${error.message}`);
    }
  };
  
  const handleConfirmOrder = async () => {
    try {
      // Here you should call the API to confirm the order
      // For now, simulate server response with some unavailable items
      const simulateUnavailable = cartItems.filter(() => Math.random() < 0.3); // 30% chance
      
      if (simulateUnavailable.length > 0) {
        // Some items are no longer available
        setUnavailableItems(simulateUnavailable.map(item => item.id));
        setTimeout(() => {
          setUnavailableItems([]);
        }, 5000);
        setError("Problem with the order! Some items are no longer available.");
      } else {
        // All items are available, confirm order
        setSuccessMessage("Order Confirmed!");
        clearCart();
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      setError(`Failed to confirm order: ${error.message}`);
    }
  };
  
  // Helper function to safely capitalize a string
  const capitalizeString = (str) => {
    if (typeof str !== 'string' || !str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Shopping Cart</h2>
      
      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      
      {/* Error Message */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your shopping cart...</p>
        </div>
      )}
      
      {!loading && !error && cartItems.length === 0 ? (
        <div className="text-center">
          <h4>Your cart is empty</h4>
          <Button variant="primary" href="/bags">Browse Food Bags</Button>
        </div>
      ) : (
        <>
          <Row>
            {cartItems.map((item, index) => (
              <Col md={6} lg={4} key={index} className="mb-3">
                <Card>
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        {capitalizeString(item.type)}
                      </span>
                      <Badge bg="info">
                        {typeof item.size === 'string' ? capitalizeString(item.size) : String(item.size)}
                      </Badge>
                    </div>
                    <Badge bg={getStatusBadgeVariant(item.status)} className="mt-1">
                      {item.status === 'available' ? 'Available' : 'Reserved'}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <h6>{item.establishment}</h6>
                    <p className="text-muted mb-1">
                      <small>Pickup: {item.pickupTimeRange}</small>
                    </p>
                    <p className="h5 text-success">
                      <strong>€{item.price.toFixed(2)}</strong>
                    </p>
                    {item.contents && item.type && item.type.toLowerCase() === 'regular' && (
                      <div className="mt-2">
                        <strong>Contents:</strong>
                        <ul className="list-unstyled mt-1">
                          {item.contents.map((content, idx) => (
                            !removedItems[item.id]?.includes(idx) && (
                              <li key={idx} className="d-flex justify-content-between align-items-center">
                                <span>{content.quantity} x {content.item}</span>
                                {(removedItems[item.id]?.length || 0) < 2 && (
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger"
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
                    <Button 
                      variant="danger" 
                      className="w-100"
                      disabled={removingItems.has(item.id)}
                      onClick={() => removeFromCart(item.id)}
                    >
                      {removingItems.has(item.id) ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Removing...
                        </>
                      ) : (
                        'Remove from Cart'
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {cartItems.length > 0 && (
            <Row className="mt-4">
              <Col md={8} lg={6} className="mx-auto">
                <Card>
                  <Card.Header>
                    <h5>Order Summary</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Items ({cartItems.length}):</span>
                      <span>€{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong>€{calculateTotal().toFixed(2)}</strong>
                    </div>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Allergies:</Form.Label>
                      <Form.Control
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="List any allergies..."
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Special Requests:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests..."
                      />
                    </Form.Group>
                    
                    <div className="d-grid gap-2">
                      <Button variant="success" size="lg" onClick={handleConfirmOrder}>
                        Confirm Order
                      </Button>
                      <Button variant="outline-danger" onClick={clearCart}>
                        Clear Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingCart;