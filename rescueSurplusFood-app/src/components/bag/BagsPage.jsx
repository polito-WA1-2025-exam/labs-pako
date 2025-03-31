import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BagsList from './BagsList';
import BagsFilter from './BagsFilter';
import BagsSummary from './BagsSummary';
import HeroSection from '../HeroSection';

// Questo è il contenitore principale per la visualizzazione delle borse disponibili:

function BagsPage() {
  // Dati di esempio per le borse
  const [bags, setBags] = useState([
    {
      id: 1,
      type: "surprise",
      size: "small",
      price: 4.99,
      establishment: "Artisan Bakery",
      pickupTimeRange: "10:00 - 12:00",
      status: "available"
    },
    {
      id: 2,
      type: "regular",
      size: "medium",
      price: 7.99,
      establishment: "Pasta Paradise",
      pickupTimeRange: "14:00 - 16:00",
      status: "available",
      contents: [
        { item: "Spaghetti", quantity: 2 },
        { item: "Tomato Sauce", quantity: 1 },
        { item: "Parmesan", quantity: 1 }
      ]
    },
    {
      id: 3,
      type: "surprise",
      size: "large",
      price: 9.99,
      establishment: "Asian Fusion",
      pickupTimeRange: "18:00 - 20:00",
      status: "reserved"
    },
    {
      id: 4,
      type: "regular",
      size: "small",
      price: 5.99,
      establishment: "Fresh Market",
      pickupTimeRange: "13:00 - 15:00",
      status: "available",
      contents: [
        { item: "Apples", quantity: 2 },
        { item: "Bananas", quantity: 3 },
        { item: "Oranges", quantity: 1 }
      ]
    }
  ]);

  // Funzione per contare le borse disponibili e riservate
  const countBagsByStatus = () => {
    const available = bags.filter(bag => bag.status === "available").length;
    const reserved = bags.filter(bag => bag.status === "reserved").length;
    return { available, reserved };
  };

  const bagCounts = countBagsByStatus();

  return (

    
    <>
      <HeroSection 
        title="Available Bags" 
        subtitle="Browse and reserve surplus food bags from our participating establishments." 
      />

      <section className='bg-light bg-gradient'>  
        <Container>
          <Row className="mb-4 p-5 bg-light-green rounded">
              <Col md={8}>
                <BagsFilter />
              </Col>
              <Col md={4}>
                <BagsSummary available={bagCounts.available} reserved={bagCounts.reserved} />
              </Col>
          </Row>
        </Container>
      </section>

      <Container className="mt-4">
        
        <BagsList bags={bags} />
      </Container>
    </>
  );
}

export default BagsPage;