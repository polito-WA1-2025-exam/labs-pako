import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function EstablishmentCard({ establishment }) {
  const { name, cuisineType, address, phone, description } = establishment;

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
      </Card.Body>
    </Card>
  );
}

export default EstablishmentCard;