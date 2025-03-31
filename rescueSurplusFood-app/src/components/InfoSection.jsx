import React from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap';

function InfoSection() {
  return (
    <Row className="mt-5 mb-5">
      <Col md={6}>
        <Card className="h-100 shadow-lg border-0 rounded-3">
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ color: 'var(--accent-color)' }}>
              How It Works
            </Card.Title>
            <ListGroup variant="flush" numbered>
              <ListGroup.Item className="border-0">
                <i className="bi bi-shop-window me-3" style={{ color: 'var(--primary-color)' }}></i>
                Browse participating establishments
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <i className="bi bi-person-circle me-3" style={{ color: 'var(--primary-color)' }}></i>
                Sign up or log in to see available bags
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <i className="bi bi-bag-check me-3" style={{ color: 'var(--primary-color)' }}></i>
                Reserve your bags from your favorite places
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <i className="bi bi-clock me-3" style={{ color: 'var(--primary-color)' }}></i>
                Pick up your food at the designated time
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <i className="bi bi-heart-fill me-3" style={{ color: 'var(--primary-color)' }}></i>
                Enjoy delicious food at a discount while reducing waste
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="h-100 shadow-lg border-0 rounded-3">
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ color: 'var(--accent-color)' }}>
              Our Bag Types
            </Card.Title>
            <div className="d-flex mb-3 align-items-start">
              <i className="bi bi-gift-fill me-3 fs-3" style={{ color: 'var(--primary-color)' }}></i>
              <div>
                <h5>Surprise Bags</h5>
                <p>A mystery assortment of surplus food items. Perfect for adventurous eaters who enjoy variety.</p>
              </div>
            </div>
            <div className="d-flex mb-3 align-items-start">
              <i className="bi bi-basket-fill me-3 fs-3" style={{ color: 'var(--primary-color)' }}></i>
              <div>
                <h5>Regular Bags</h5>
                <p>See exactly what you're getting before you order. Great for those with specific preferences or dietary needs.</p>
              </div>
            </div>
            <div className="text-center mt-3">
              <small>Available in Small, Medium, and Large sizes</small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default InfoSection;
