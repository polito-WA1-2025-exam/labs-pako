import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Importa il hook useCart

function EstablishmentDetail() {
  const { id } = useParams(); // Ottiene l'id dall'URL
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Ottieni la funzione addToCart dal contesto

  // Simula il caricamento dei dati dell'establishment dall'API
  useEffect(() => {
    // In un'app reale, qui faresti una chiamata API usando l'id
    // Per ora simuliamo il caricamento dei dati
    const fetchEstablishment = () => {
      // Dati di esempio degli establishment (stessi dati del componente EstablishmentsList)
      const establishments = [
        {
          "id": 1,
          "name": "Green Grocers",
          "address": "123 Main St, Springfield",
          "phoneNumber": "555-1234",
          "category": "Grocery",
          "type": "Supermarket",
          "bags": [
            {
              id: 101,
              type: "regular",
              content: ["3 Apples", "2 Bananas", "1 Loaf of Bread"],
              price: 5.99,
              size: "medium",
              pickupTime: "10:00 AM - 1:00 PM",
              establishment: "Green Grocers" // Aggiungi il nome dell'establishment
            },
            {
              id: 102,
              type: "surprise",
              price: 3.99,
              size: "small",
              pickupTime: "2:00 PM - 4:00 PM",
              establishment: "Green Grocers" // Aggiungi il nome dell'establishment
            }
          ],
          "content": "Ampia selezione di prodotti freschi, latticini e pane appena sfornato. Offerte speciali sui prodotti locali ogni settimana."
        },
        {
          "id": 2,
          "name": "Fresh Mart",
          "address": "456 Elm St, Springfield",
          "phoneNumber": "555-5678",
          "category": "Grocery",
          "type": "Convenience Store",
          "bags": [
            {
              id: 201,
              type: "surprise",
              price: 4.99,
              size: "medium",
              pickupTime: "11:00 AM - 2:00 PM",
              establishment: "Fresh Mart" // Aggiungi il nome dell'establishment
            }
          ],
          "content": "Il tuo negozio di fiducia per acquisti veloci. Trova snack, bevande, articoli per la casa e una piccola selezione di frutta e verdura fresca."
        },
        {
          "id": 3,
          "name": "Organic Heaven",
          "address": "789 Oak St, Springfield",
          "phoneNumber": "555-9101",
          "category": "Grocery",
          "type": "Organic Store",
          "bags": [
            {
              id: 301,
              type: "regular",
              content: ["Organic Spinach", "5 Organic Carrots", "1 Organic Milk"],
              price: 7.99,
              size: "large",
              pickupTime: "9:00 AM - 12:00 PM",
              establishment: "Organic Heaven" // Aggiungi il nome dell'establishment
            }
          ],
          "content": "Prodotti biologici certificati, alimenti senza glutine e una vasta gamma di opzioni vegane. Scopri sapori naturali e sostenibili."
        },
        {
          "id": 4,
          "name": "The Daily Bread",
          "address": "10 Downing St, London",
          "phoneNumber": "+44 20 7946 0917",
          "category": "Bakery",
          "type": "Artisan",
          "bags": [],
          "content": "Panetteria artigianale che sforna ogni giorno pane con lievito madre, croissant fragranti e dolci tradizionali. Ingredienti di alta qualità e passione per la panificazione."
        },
        {
          "id": 5,
          "name": "Spice Route",
          "address": "221B Baker St, London",
          "phoneNumber": "+44 20 7224 3688",
          "category": "Restaurant",
          "type": "Indian",
          "bags": [
            {
              id: 501,
              type: "surprise",
              price: 8.99,
              size: "large",
              pickupTime: "8:00 PM - 10:00 PM",
              establishment: "Spice Route" // Aggiungi il nome dell'establishment
            }
          ],
          "content": "Autentica cucina indiana con un menu ricco di curry aromatici, tandoori succulenti e specialità regionali. Spezie fresche e ricette tradizionali per un'esperienza di gusto unica."
        },
        {
          "id": 6,
          "name": "Pizza Place",
          "address": "5th Ave, New York",
          "phoneNumber": "212-555-1212",
          "category": "Restaurant",
          "type": "Pizzeria",
          "bags": [],
          "content": "Le migliori pizze di New York, cotte nel forno a legna con ingredienti freschi e di stagione. Dalle classiche Margherita alle creazioni gourmet, ce n'è per tutti i gusti."
        },
        {
          "id": 7,
          "name": "Coffee Corner",
          "address": "Wall Street, New York",
          "phoneNumber": "212-555-0000",
          "category": "Café",
          "type": "Specialty Coffee",
          "bags": [],
          "content": "Caffè d'eccellenza da chicchi selezionati, preparato con cura dai nostri baristi esperti. Offriamo anche una varietà di tè, pasticcini e opzioni per la colazione e il pranzo."
        },
        {
          "id": 8,
          "name": "Healthy Harvest",
          "address": "Sunset Blvd, Los Angeles",
          "phoneNumber": "310-555-9876",
          "category": "Market",
          "type": "Farmers Market",
          "bags": [
            {
              id: 801,
              type: "regular",
              content: ["Fresh Strawberries", "Local Honey", "Artisan Cheese"],
              price: 9.99,
              size: "large",
              pickupTime: "1:00 PM - 4:00 PM",
              establishment: "Healthy Harvest" // Aggiungi il nome dell'establishment
            }
          ],
          "content": "Mercato agricolo con prodotti freschi locali, frutta e verdura di stagione, formaggi artigianali e altri prodotti alimentari di piccoli produttori. Un'esperienza di shopping all'insegna della gioia."
        }
      ];

      // Trova l'establishment corrispondente all'id
      const found = establishments.find(est => est.id === parseInt(id));
      setEstablishment(found);
      setLoading(false);
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

  // Se non è stato trovato l'establishment, mostra un messaggio di errore
  if (!establishment) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h3>Establishment not found</h3>
          <Link to="/">Go back to Home</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
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
              {establishment.bags.length > 0 ? (
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
                                {bag.content.map((item, index) => (
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
                          <h4 className="text-primary mb-3">${bag.price.toFixed(2)}</h4>
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