import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BagCard from './BagCard';
// Componente per visualizzare l'elenco delle borse:

function BagsList({ bags }) {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {bags.map(bag => (
        <Col key={bag.id}>
          <BagCard bag={bag} />
        </Col>
      ))}
    </Row>
  );
}

export default BagsList;