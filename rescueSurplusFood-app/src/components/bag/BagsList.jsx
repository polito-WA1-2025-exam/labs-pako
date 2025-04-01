import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BagCard from './BagCard';

function BagsList({ bags, addToCart }) {
  return (
    <Row>
      {bags.map(bag => (
        <Col key={bag.id} md={4} className="mb-4">
          <BagCard bag={bag} addToCart={addToCart} />
        </Col>
      ))}
    </Row>
  );
}

export default BagsList;
