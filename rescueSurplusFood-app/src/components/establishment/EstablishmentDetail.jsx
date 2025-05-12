import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Importa il hook useCart
import { getEstablishmentById } from '../../API.mjs'; // Importa la funzione API

function EstablishmentDetail() {
  const { id } = useParams(); // Ottiene l'id dall'URL
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Ottieni la funzione addToCart dal contesto

  useEffect(() => {
    const fetchEstablishment = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEstablishmentById(id);
        setEstablishment(data);
      } catch (err) {
        setError(err.message || `Failed to fetch establishment with ID ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishment();
  }, [id]);

  // Se i dati sono ancora in caricamento, mostra un messaggio di caricamento
  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <p>Loading establishment details...</p>
        </div>
      </Container>
    );
  }

  // Se c'è un errore nel caricamento, mostra un messaggio di errore
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger" className="text-center">
          <h3>Error loading establishment details</h3>
          <p>{error}</p>
          <Link to="/" className="btn btn-outline-secondary mt-2">
            Back to Home
          </Link>
        </Alert>
      </Container>
    );
  }

  // Se non è stato trovato l'establishment, mostra un messaggio di errore
  if (!establishment) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h3>Establishment not found</h3>
          <Link to="/" className="btn btn-outline-secondary mt-2">
            Back to Home
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 pb-4">
      <Row>
        <Col>
          <Link to="/" className="btn btn-outline-secondary mb-3">
            <i className="bi bi-arrow-left"></i> Back to Establishments
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2>{establishment.name}</h2>
              <Badge className="cuisine-badge">{establishment.category} - {establishment.type}</Badge>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>Contact Information</h5>
                  <div className="store-info mb-2">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    <span>{establishment.address}</span>
                  </div>
                  <div className="store-info mb-3">
                    <i className="bi bi-telephone-fill me-2"></i>
                    <span>{establishment.phoneNumber}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <h5>Description</h5>
                  <p>{establishment.content}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3>Available Bags</h3>
            </Card.Header>
            <Card.Body>
              {establishment.bags && establishment.bags.length > 0 ? (
                <ListGroup>
                  {establishment.bags.map(bag => (
                    <ListGroup.Item key={bag.id} className="mb-3">
                      <Row>
                        <Col md={8}>
                          <h5>
                            {bag.type === "surprise" ? "Surprise Bag" : "Regular Bag"}
                            <Badge bg={bag.type === "surprise" ? "warning" : "success"} className="ms-2">
                              {bag.size}
                            </Badge>
                          </h5>

                          {bag.type === "regular" && (
                            <div className="mt-2">
                              <h6>Contents:</h6>
                              <ul>
                                {bag.content && bag.content.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <p className="mt-2 mb-1">
                            <strong>Pickup Time:</strong> {bag.pickupTime}
                          </p>
                        </Col>
                        <Col md={4} className="d-flex flex-column justify-content-center align-items-end">
                          <h4 className="text-primary mb-3">${bag.price && bag.price.toFixed(2)}</h4>
                          <Button variant="primary" onClick={() => addToCart(bag)}> {/* Usa la funzione addToCart */}
                            Add to Cart
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No bags are currently available from this establishment.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EstablishmentDetail;