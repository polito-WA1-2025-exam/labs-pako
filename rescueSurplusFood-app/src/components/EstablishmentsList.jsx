import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EstablishmentCard from './EstablishmentCard';

function EstablishmentsList() {
  // Questo array potrebbe venire da un API in un'implementazione reale
  const establishments = [
    {
      id: 1,
      name: "Artisan Bakery",
      cuisineType: "Bakery",
      address: "45 Piazza Roma, Turin",
      phone: "+39 011 987 6543",
      description: "Freshly baked breads, pastries, and desserts made with locally sourced ingredients."
    },
    {
      id: 2,
      name: "Asian Fusion",
      cuisineType: "Asian",
      address: "54 Via Po, Turin",
      phone: "+39 011 678 9012",
      description: "Modern restaurant combining flavors from various Asian cuisines with a contemporary twist."
    },
    {
      id: 3,
      name: "Bella Pizza",
      cuisineType: "Pizzeria",
      address: "78 Via Napoli, Turin",
      phone: "+39 011 345 6789",
      description: "Traditional Neapolitan pizzas baked in a wood-fired oven with premium toppings."
    },
    {
      id: 4,
      name: "Café Milano",
      cuisineType: "Café",
      address: "15 Via Milano, Turin",
      phone: "+39 011 456 7890",
      description: "Cozy café offering specialty coffees, sandwiches, and homemade pastries."
    },
    {
      id: 5,
      name: "Fresh Market",
      cuisineType: "Grocery",
      address: "32 Corso Francia, Turin",
      phone: "+39 011 567 8901",
      description: "Local grocery store with fresh produce, dairy products, and organic food options."
    },
    {
      id: 6,
      name: "Pasta Paradise",
      cuisineType: "Italian",
      address: "123 Main Street, Turin",
      phone: "+39 011 234 5678",
      description: "Authentic Italian restaurant specializing in homemade pasta and regional specialties."
    },
    {
      id: 7,
      name: "Vegan Delight",
      cuisineType: "Vegan",
      address: "67 Via Verdi, Turin",
      phone: "+39 011 890 1234",
      description: "Plant-based restaurant with creative dishes made from seasonal, organic ingredients."
    },
    {
      id: 8,
      name: "Wine & Dine",
      cuisineType: "Fine Dining",
      address: "90 Corso Vittorio, Turin",
      phone: "+39 011 901 2345",
      description: "Elegant restaurant specializing in refined Italian cuisine paired with selected wines."
    }
  ];

  return (
    <Container>
      <h2 className="page-title">Participating Establishments</h2>
      <p className="mb-4">Browse our partners who are committed to reducing food waste. All establishments are displayed in alphabetical order.</p>
      
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {establishments.map(establishment => (
          <Col key={establishment.id}>
            <EstablishmentCard establishment={establishment} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EstablishmentsList;