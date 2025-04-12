import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

function EstablishmentCard({ establishment, onEdit }) {
  const { id, name, cuisineType, address, phone, description } = establishment;

  // Funzione per gestire il clic sul pulsante di modifica
  const handleEditClick = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  return (
    <Card className="store-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>{name}</span>
        <Badge className="cuisine-badge">{cuisineType}</Badge>
      </Card.Header>
      <Card.Body>
        <div className="store-info">
          <i className="bi bi-geo-alt-fill"></i>
          <span>{address}</span>
        </div>
        <div className="store-info">
          <i className="bi bi-telephone-fill"></i>
          <span>{phone}</span>
        </div>
        <hr />
        <Card.Text>{description}</Card.Text>
        {onEdit && (
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleEditClick}
            >
              <i className="bi bi-pencil-fill me-1"></i>
              Edit
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default EstablishmentCard;