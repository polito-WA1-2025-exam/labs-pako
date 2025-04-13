import React from 'react';
import { Card, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import BagContents from './BagContents';
import { useCart } from '../context/CartContext';

function BagCard({ bag, onEdit, onDelete }) { // Aggiungiamo la prop onDelete
  const { type, size, price, establishment, pickupTimeRange, status, contents } = bag;
  const { addToCart } = useCart();
  
  // Determina lo stile del badge in base allo stato
  const getStatusBadgeVariant = () => {
    return status === 'available' ? 'success' : 'warning';
  };
  
  // Determina lo stile del badge in base al tipo di borsa
  const getTypeBadgeVariant = () => {
    return type === 'surprise' ? 'info' : 'primary';
  };
  
  // Determina lo stile del badge in base alla dimensione
  const getSizeBadgeVariant = () => {
    switch(size) {
      case 'small': return 'secondary';
      case 'medium': return 'secondary';
      case 'large': return 'secondary';
      default: return 'secondary';
    }
  };
  
  return (
    <Card className={`bag-card ${status === 'reserved' ? 'reserved-bag' : ''}`}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <Badge bg={getTypeBadgeVariant()} className="me-1">
            {type === 'surprise' ? 'Surprise' : 'Regular'}
          </Badge>
          <Badge bg={getSizeBadgeVariant()}>
            {size.charAt(0).toUpperCase() + size.slice(1)}
          </Badge>
        </div>
        <div>
          <Badge bg={getStatusBadgeVariant()} className="me-2">
            {status === 'available' ? 'Available' : 'Reserved'}
          </Badge>
          {status === 'available' && (
            <>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => onEdit(bag)}
                className="me-1"
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onDelete(bag)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </>
          )}
        </div>
      </Card.Header>
      
      <Card.Body>
        <Card.Title className="mb-3">{establishment}</Card.Title>
        
        <div className="bag-info mb-2">
          <i className="bi bi-clock me-2"></i>
          <span>Pickup: {pickupTimeRange}</span>
        </div>
        
        <div className="bag-info mb-3">
          <i className="bi bi-tag me-2"></i>
          <span className="fw-bold">${Number(price).toFixed(2)}</span>
        </div>
        
        {type === 'regular' && contents && (
          <div className="bag-contents">
            <BagContents contents={contents} />
          </div>
        )}
        
        {status === 'available' && (
          <div className="mt-3">
            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Select size="sm">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </Form.Select>
            </Form.Group>
            <Button 
              variant="primary" 
              className="w-100" 
              onClick={() => addToCart(bag)}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default BagCard;