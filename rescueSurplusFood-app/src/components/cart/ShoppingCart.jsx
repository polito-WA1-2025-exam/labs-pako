import React, { useState } from "react";
import { Card, Badge, Button, Form, Row, Col } from 'react-bootstrap'; // Importa i componenti di React-Bootstrap
import { useCart } from '../context/CartContext';  // Importa il contesto
import AllergiesForm from './AllergiesForm';  // Form per le allergie

const ShoppingCart = () => {  
  const { cartItems, removeFromCart } = useCart();  // Usa il contesto per ottenere gli articoli del carrello
  const [allergies, setAllergies] = useState('');

  // Calcola il totale del carrello
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Funzione per determinare il badge dello stato
  const getStatusBadgeVariant = (status) => {
    return status === 'available' ? 'success' : 'warning';
  };

  return (
    <div className="shopping-cart p-4">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
          <p>Your cart is empty</p>
          <a href="/bags" className="btn btn-primary">
            Browse Food Bags
          </a>
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
                          <li key={idx}>{content.quantity} x {content.item}</li>
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

          {/* Allergies Form Section */}
          <Card className="mt-4 shadow-sm border-light">
            <Card.Body>
              <h5 className="mb-3">Any Allergies?</h5>
              <Form.Group controlId="formAllergies">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Let us know if you have any allergies"
                  className="mb-3"
                />
                <Button variant="primary" onClick={() => alert("Allergies noted!")}>
                  Submit Allergies
                </Button>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Order Summary Section */}
          <Card className="mt-4 shadow-sm border-light">
            <Card.Body>
              <h3 className="mb-4">Order Summary</h3>
              <Row className="mb-2">
                <Col sm={6}>
                  <span>Items ({cartItems.length}):</span>
                </Col>
                <Col sm={6} className="text-end">
                  <span>€{calculateTotal().toFixed(2)}</span>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col sm={6}>
                  <strong>Total:</strong>
                </Col>
                <Col sm={6} className="text-end">
                  <strong>€{calculateTotal().toFixed(2)}</strong>
                </Col>
              </Row>
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
