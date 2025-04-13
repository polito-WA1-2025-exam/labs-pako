import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import BagCard from './BagCard';
import '../../styles/style.css'; // Importa il tuo CSS personalizzato

function BagsList({ bags, onEditBag, onDeleteBag }) {
  // Gestione del caso in cui non ci sono borse
  if (!bags || bags.length === 0) {
    return (
      <Alert variant="info">
        Non ci sono borse disponibili al momento. Riprova più tardi.
      </Alert>
    );
  }
  
  return (
    <Row className="row-cols-1 row-cols-md-3 g-4 same-height-cards pb-4">
      {bags.map(bag => (
        <Col key={bag.id}>
          {/* Passa entrambe le funzioni onEditBag e onDeleteBag alla BagCard */}
          <BagCard 
            bag={bag} 
            onEdit={onEditBag} 
            onDelete={onDeleteBag} 
          />
        </Col>
      ))}
    </Row>
  );
}

export default BagsList;