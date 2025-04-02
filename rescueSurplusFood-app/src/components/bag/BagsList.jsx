import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BagCard from './BagCard';
import '../../styles/style.css'; // Importa un file CSS

function BagsList({ bags }) {
  return (
    <Row className="row-cols-1 row-cols-md-3 g-4 same-height-cards pb-4"> {/* Aggiungi la classe custom */}
      {bags.map(bag => (
        <Col key={bag.id}>
          <BagCard bag={bag} />
        </Col>
      ))}
    </Row>
  );
}

export default BagsList;