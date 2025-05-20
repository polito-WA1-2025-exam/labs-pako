
import React, { useState } from 'react';
import { Card, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import BagContents from './BagContents';
import { useCart } from '../context/CartContext';

function BagCard({ bag, onEdit, onDelete }) {
  const { type, size, price, establishment, pickupTimeRange, status, contents } = bag;
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
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
  
  // Helper function to safely capitalize the size
  const formatSize = (size) => {
    if (!size || typeof size !== 'string') {
      return 'Unknown';
    }
    return size.charAt(0).toUpperCase() + size.slice(1);
  };
  
  // Handle add to cart with server communication
  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(bag);
      setIsAdding(false);
    } catch (error) {
      setIsAdding(false);
      console.error("Failed to add bag to cart:", error);
    }
  };
  
  return (
    <Card className="mb-3 h-100">
      <Card.Header>
        <Row className="align-items-center">
          <Col xs={8}>
            <Badge bg={getTypeBadgeVariant()} className="me-2">
              {type === 'surprise' ? 'Surprise' : 'Regular'}
            </Badge>
            <Badge bg={getSizeBadgeVariant()}>
              {formatSize(size)}
            </Badge>
          </Col>
          <Col xs={4} className="text-end">
            <Badge bg={getStatusBadgeVariant()}>
              {status === 'available' ? 'Available' : 'Reserved'}
            </Badge>
            {status === 'available' && (
              <>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => onEdit(bag)}
                  className="me-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => onDelete(bag)}
                >
                  Delete
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          {establishment}
        </Card.Title>
        <Card.Text>
          <small className="text-muted">
            Pickup: {pickupTimeRange}
          </small>
        </Card.Text>
        <Card.Text>
          <strong>
            ${Number(price).toFixed(2)}
          </strong>
        </Card.Text>
        {type === 'regular' && contents && (
          <BagContents contents={contents} />
        )}
        
        {status === 'available' && (
          <Row className="mt-3">
            <Col xs={4}>
              <Form.Label>Quantity</Form.Label>
              <Form.Select 
                size="sm" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </Form.Select>
            </Col>
            <Col xs={8} className="d-flex align-items-end">
              <Button 
                variant="primary" 
                className="w-100" 
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default BagCard;