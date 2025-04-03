import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BagsList from './BagsList';
import BagsFilter from './BagsFilter';
import BagsSummary from './BagsSummary';
import HeroSection from '../HeroSection';

function BagsPage() {
  const [bags, setBags] = useState([]);

  // Simuleremo una chiamata API qui
  useEffect(() => {
    const fetchBags = async () => {
      // In una vera applicazione, faresti una chiamata fetch qui
      const apiBagsData = [
        {
          "id": 1,
          "type": "regular",
          "size": 1,
          "price": 10.99,
          "establishmentId": 1,
          "state": "available",
          "userId": 1,
          "removedItems": [],
          "content": [
            { "BagID": 1, "FoodItemID": 1, "Quantity": 2 },
            { "BagID": 1, "FoodItemID": 2, "Quantity": 1 }
          ],
          "timeToPickUp": "2025-04-04 12:00",
          "creationDate": "2025-03-16 09:01"
        },
        {
          "id": 2,
          "type": "surprise",
          "size": 2,
          "price": 15.99,
          "establishmentId": 2,
          "state": "reserved",
          "userId": 2,
          "removedItems": [
            { "RemovedItemID": 2, "CreationDate": "2025-03-16 09:01:43", "Quantity": 1, "BagID": 2 }
          ],
          "content": [
            { "BagID": 2, "FoodItemID": 3, "Quantity": 3 }
          ],
          "timeToPickUp": "2025-04-04 14:00",
          "creationDate": "2025-03-16 09:01"
        },
        {
          "id": 3,
          "type": "regular",
          "size": 0,
          "price": 8.50,
          "establishmentId": 3,
          "state": "available",
          "userId": null,
          "removedItems": [],
          "content": [
            { "BagID": 3, "FoodItemID": 4, "Quantity": 1 },
            { "BagID": 3, "FoodItemID": 5, "Quantity": 2 }
          ],
          "timeToPickUp": "2025-04-04 11:30",
          "creationDate": "2025-03-20 15:45"
        },
        {
          "id": 4,
          "type": "surprise",
          "size": 1,
          "price": 12.00,
          "establishmentId": 1,
          "state": "available",
          "userId": null,
          "removedItems": [],
          "content": [
            { "BagID": 4, "FoodItemID": 6, "Quantity": 4 }
          ],
          "timeToPickUp": "2025-04-04 18:00",
          "creationDate": "2025-03-25 10:20"
        },
        {
          "id": 5,
          "type": "regular",
          "size": 2,
          "price": 19.99,
          "establishmentId": 4,
          "state": "reserved",
          "userId": 3,
          "removedItems": [],
          "content": [
            { "BagID": 5, "FoodItemID": 7, "Quantity": 2 },
            { "BagID": 5, "FoodItemID": 8, "Quantity": 1 },
            { "BagID": 5, "FoodItemID": 9, "Quantity": 3 }
          ],
          "timeToPickUp": "2025-04-04 19:15",
          "creationDate": "2025-03-28 08:55"
        }
      ];

      // Trasformiamo i dati API nel formato che il componente si aspetta
      const transformedBags = apiBagsData.map(bag => {
        let sizeText = "";
        switch (bag.size) {
          case 0:
            sizeText = "small";
            break;
          case 1:
            sizeText = "medium";
            break;
          case 2:
            sizeText = "large";
            break;
          default:
            sizeText = "unknown";
        }

        // Estraiamo solo l'orario dalla stringa timeToPickUp
        const pickupTime = bag.timeToPickUp ? bag.timeToPickUp.split(' ')[1].slice(0, 5) : 'N/A';
        const pickupTimeRange = pickupTime !== 'N/A' ? `${pickupTime} - ${pickupTime}` : 'N/A'; // Potresti volerlo rendere un intervallo se l'API lo fornisce

        const contents = bag.content ? bag.content.map(item => ({
          item: `FoodItem ID ${item.FoodItemID}`, // Dovresti recuperare il nome effettivo dell'oggetto alimentare dalla tua API
          quantity: item.Quantity
        })) : [];

        return {
          id: bag.id,
          type: bag.type,
          size: sizeText,
          price: bag.price,
          establishment: `Establishment ID ${bag.establishmentId}`, // Dovresti recuperare il nome effettivo dell'establishment dalla tua API
          pickupTimeRange: pickupTimeRange,
          status: bag.state,
          contents: contents
        };
      });

      setBags(transformedBags);
    };

    fetchBags();
  }, []);

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