import React from 'react';
import { Card } from 'react-bootstrap';

// Componente per visualizzare il riepilogo delle borse disponibili e riservate:

function BagsSummary({ available, reserved }) {
  return (
    <Card className="text-center">
      <Card.Body>
        <h5 className="mb-3">Bags Summary</h5>
        <div className="d-flex justify-content-around">
          <div>
            <span className="d-block fs-4 fw-bold text-success">{available}</span>
            <span className="text-muted">Available</span>
          </div>
          <div>
            <span className="d-block fs-4 fw-bold text-warning">{reserved}</span>
            <span className="text-muted">Reserved</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BagsSummary;