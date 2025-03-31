import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
// Componente per filtrare le borse per tipo, dimensione, ecc.:
function BagsFilter() {
  return (
    <Form>
      <Row className="align-items-end">
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Bag Type</Form.Label>
            <Form.Select>
              <option value="">All Types</option>
              <option value="surprise">Surprise Bags</option>
              <option value="regular">Regular Bags</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Size</Form.Label>
            <Form.Select>
              <option value="">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Establishment</Form.Label>
            <Form.Select>
              <option value="">All Establishments</option>
              <option value="Artisan Bakery">Artisan Bakery</option>
              <option value="Pasta Paradise">Pasta Paradise</option>
              <option value="Asian Fusion">Asian Fusion</option>
              <option value="Fresh Market">Fresh Market</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Button variant="primary" className="w-100 mb-3">
            Apply Filters <i className="bi bi-funnel-fill ms-1"></i>
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default BagsFilter;