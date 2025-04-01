import React, { useState } from "react";
import { Card, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const ShoppingCart = () => {  
  const { cartItems, removeFromCart } = useCart();
  const [allergies, setAllergies] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [removedItems, setRemovedItems] = useState({});

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

  return (
    <div className="shopping-cart p-4">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
          <p>Your cart is empty</p>
          <a href="/bags" className="btn btn-primary">Browse Food Bags</a>
        </div>
      ) : (
        <>
          <div className="cart-items mb-4">
            {cartItems.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge bg="primary" className="me-1">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                    <Badge bg="secondary">
                      {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
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
                  {item.contents && (
                    <div className="mb-3">
                      <strong>Contents:</strong>
                      <ul>
                        {item.contents.map((content, idx) => (
                          !removedItems[item.id]?.includes(idx) && (
                            <li key={idx}>
                              {content.quantity} x {content.item} 
                              {item.type.toLowerCase() === 'regular' && (removedItems[item.id]?.length || 0) < 2 && (
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
              <Button variant="success" className="w-100">
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