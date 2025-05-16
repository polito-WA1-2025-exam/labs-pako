import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { getEstablishmentById } from '../../API.mjs';
import EstablishmentBags from './EstablishmentBags';

function EstablishmentDetail() {
  const { id } = useParams(); // Ottiene l'id dall'URL
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

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
              {/* Ora utilizziamo il componente EstablishmentBags per gestire la visualizzazione e il filtraggio delle borse */}
              <EstablishmentBags establishmentId={id} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EstablishmentDetail;