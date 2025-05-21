import React from 'react';
import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EstablishmentCard({ establishment, onEdit, onDelete, isDeleting }) {
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
    if (onDelete && !isDeleting) {
      // Chiediamo conferma prima di eliminare
      if (window.confirm(`Sei sicuro di voler eliminare "${name}"? Questa azione non può essere annullata.`)) {
        onDelete(id);
      }
    }
  };
  
  return (
    <Card as={Link} to={`/establishments/${id}`} className="store-card text-decoration-none text-reset h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>{name}</span>
        <Badge className="cuisine-badge">{cuisineType}</Badge>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <div className="store-info">
          <i className="bi bi-geo-alt-fill me-2"></i>
          <span>{address}</span>
        </div>
        <div className="store-info">
          <i className="bi bi-telephone-fill me-2"></i>
          <span>{phone}</span>
        </div>
        <hr />
        <Card.Text className="flex-grow-1">{description}</Card.Text>
        {(onEdit || onDelete) && (
          <div className="d-flex justify-content-between align-items-center mt-3">
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
                  disabled={isDeleting}
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
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash-fill me-1"></i>
                      Delete
                    </>
                  )}
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