
import React from 'react';
import { ListGroup } from 'react-bootstrap';
// Componente per visualizzare i contenuti di una borsa regolare:
function BagContents({ contents }) {
  return (
    <div className="bag-contents">
      <h6 className="mb-2">Contents:</h6>
      <ListGroup variant="flush" className="bag-contents-list">
        {contents.map((item, index) => (
          <ListGroup.Item key={index} className="py-1 border-0">
            {item.quantity} × {item.item}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default BagContents;