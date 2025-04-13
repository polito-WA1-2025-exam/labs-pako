import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import BagsList from './BagsList';
import BagsFilter from './BagsFilter';
import BagsSummary from './BagsSummary';
import BagForm from './BagForm';
import HeroSection from '../HeroSection';

function BagsPage() {
  const [bags, setBags] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentBag, setCurrentBag] = useState(null);
  const [modalTitle, setModalTitle] = useState("Aggiungi una Nuova Bag");

  // Simuleremo una chiamata API qui
  useEffect(() => {
    const fetchBags = async () => {
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
          "timeToPickUp": "2025-04-04 12:00",  // << questo è il 4 aprile, quindi PASSATO
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
          "timeToPickUp": "2025-04-13 20:00", // << QUESTO va bene se l'ora attuale è prima delle 20:00
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
          "timeToPickUp": "2025-04-14 11:30",  // << FUTURO
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
          "timeToPickUp": "2025-04-15 18:00",  // << FUTURO
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
          "timeToPickUp": "2025-04-16 19:15", // << FUTURO
          "creationDate": "2025-03-28 08:55"
        }
      ];
  
      const today = new Date("2025-04-13T00:00:00");  // la data corrente stabilita
      const now = new Date("2025-04-13T18:00:00");   // supponiamo siano le 18:00
  
      const filteredBags = apiBagsData.filter(bag => {
        if (!bag.timeToPickUp) return false;
  
        let bagDate;
        if (bag.timeToPickUp.includes("T")) {
          bagDate = new Date(bag.timeToPickUp);
        } else {
          bagDate = new Date(bag.timeToPickUp.replace(" ", "T"));
        }
  
        // La bag è valida se il tempo è nel futuro
        return bagDate > now;
      });
  
      const transformedBags = filteredBags.map(bag => transformBagData(bag));
      setBags(transformedBags);
    };
  
    fetchBags();
  }, []);
  

  // Funzione per trasformare i dati della bag nel formato corretto
  const transformBagData = (bag) => {
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

    // Gestisci correttamente il formato della data/ora
    let pickupTime = 'N/A';
    let pickupTimeRange = 'N/A';
    if (bag.timeToPickUp) {
      let date = '';
      let time = '';
      if (bag.timeToPickUp.includes('T')) {
        // Formato ISO
        const [fullDate, fullTime] = bag.timeToPickUp.split('T');
        date = fullDate;
        time = fullTime.slice(0, 5);
      } else {
        // Formato con spazio
        const [fullDate, fullTime] = bag.timeToPickUp.split(' ');
        date = fullDate;
        time = fullTime.slice(0, 5);
      }
      pickupTimeRange = `${date} ${time}`;
    }

    const contents = bag.content ? bag.content.map(item => ({
      item: `FoodItem ID ${item.FoodItemID}`,
      quantity: item.Quantity
    })) : [];

    return {
      id: bag.id,
      type: bag.type,
      size: sizeText,
      price: bag.price,
      establishment: `Establishment ID ${bag.establishmentId}`,
      pickupTimeRange: pickupTimeRange,
      status: bag.state,
      contents: contents,
      // Aggiungiamo i dati originali per quando abbiamo bisogno di accedervi
      originalData: bag
    };
  };

  // Funzione per aprire il form per aggiungere una nuova bag
  const handleAddNewBag = () => {
    setCurrentBag(null);
    setModalTitle("Aggiungi una Nuova Bag");
    setShowForm(true);
  };

  // Funzione per aprire il form per modificare una bag esistente
  const handleEditBag = (bag) => {
    setCurrentBag(bag);
    setModalTitle("Modifica Bag");
    setShowForm(true);
  };

  // Funzione per aggiungere una nuova bag
  const handleAddBag = (newBagData) => {
    // In una vera applicazione, faresti una chiamata API per salvare i dati
    // e poi aggiorneresti lo stato con la risposta del server
    // Per ora, aggiungiamo semplicemente la nuova bag allo stato
    const transformedNewBag = transformBagData(newBagData);
    setBags(prevBags => [...prevBags, transformedNewBag]);
    // Chiudi il form dopo l'aggiunta
    setShowForm(false);
  };

  // Funzione per aggiornare una bag esistente
  const handleUpdateBag = (updatedBagData) => {
    // In una vera applicazione, faresti una chiamata API per aggiornare i dati
    // e poi aggiorneresti lo stato con la risposta del server
    // Per ora, aggiorniamo semplicemente la bag nello stato
    const transformedUpdatedBag = transformBagData(updatedBagData);
    setBags(prevBags => prevBags.map(bag => 
      bag.id === transformedUpdatedBag.id ? transformedUpdatedBag : bag
    ));
    // Chiudi il form dopo l'aggiornamento
    setShowForm(false);
  };

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
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Button 
              variant="success" 
              onClick={handleAddNewBag}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Aggiungi Nuova Bag
            </Button>
          </Col>
        </Row>
        {/* Modal per il form di aggiunta/modifica */}
        <Modal 
          show={showForm} 
          onHide={() => setShowForm(false)} 
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BagForm 
              onAddBag={handleAddBag} 
              onUpdateBag={handleUpdateBag}
              bagToEdit={currentBag}
            />
          </Modal.Body>
        </Modal>
        <BagsList bags={bags} onEditBag={handleEditBag} />
      </Container>
    </>
  );
}

export default BagsPage;