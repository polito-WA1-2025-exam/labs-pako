import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EstablishmentCard({ establishment, onEdit, onDelete }) {
  const { id, name, cuisineType, address, phone, description } = establishment;
  
  // Funzione per gestire il clic sul pulsante di modifica
  const handleEditClick = (e) => {
    e.preventDefault(); // Evita che il clic sulla card navighi alla pagina di dettaglio
    if (onEdit) {
      onEdit(id);
    }
  };
  
  // Funzione per gestire il clic sul pulsante di eliminazione
  const handleDeleteClick = (e) => {
    e.preventDefault(); // Evita che il clic sulla card navighi alla pagina di dettaglio
    if (onDelete) {
      // Chiediamo conferma prima di eliminare
      if (window.confirm(`Sei sicuro di voler eliminare "${name}"?`)) {
        onDelete(id);
      }
    }
  };
  
  return (
    <Card as={Link} to={`/establishments/${id}`} className="store-card text-decoration-none text-reset">
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
        {(onEdit || onDelete) && (
          <div className="d-flex justify-content-between align-items-center">
            <Button 
              variant="primary" 
              size="sm" 
              as={Link}
              to={`/establishments/${id}`}
              className="me-2"
              onClick={(e) => e.stopPropagation()} // Evita che il clic navighi due volte
            >
              <i className="bi bi-info-circle me-1"></i>
              View Details
            </Button>
            <div className="d-flex gap-2">
              {onEdit && (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleEditClick}
                >
                  <i className="bi bi-pencil-fill me-1"></i>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleDeleteClick}
                >
                  <i className="bi bi-trash-fill me-1"></i>
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default EstablishmentCard;