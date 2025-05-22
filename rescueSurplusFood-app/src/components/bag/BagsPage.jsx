import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import BagsList from './BagsList';
import BagsFilter from './BagsFilter';
import BagsSummary from './BagsSummary';
import BagForm from './BagForm';
import HeroSection from '../HeroSection';
import dayjs from 'dayjs';
import { getAllBags, getEstablishmentById, getFoodItemById, deleteBag } from '../../API.mjs';

function BagsPage() {
  const [bags, setBags] = useState([]);
  const [establishments, setEstablishments] = useState({});
  const [foodItems, setFoodItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentBag, setCurrentBag] = useState(null);
  const [modalTitle, setModalTitle] = useState("Aggiungi una Nuova Bag");
  
  // Stato per il modal di conferma eliminazione
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bagToDelete, setBagToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Funzione per caricare i dati dell'establishment
  const fetchEstablishmentData = async (establishmentId) => {
    if (!establishmentId) return null;
    try {
      const establishment = await getEstablishmentById(establishmentId);
      console.log("Establishment data:", establishment);
      setEstablishments(prev => ({
        ...prev,
        [establishmentId]: establishment
      }));
      return establishment;
    } catch (error) {
      console.error(`Error fetching establishment ${establishmentId}:`, error);
      return null;
    }
  };

  // Funzione per caricare i dati del food item
  const fetchFoodItemData = async (foodItemId) => {
    try {
      const foodItem = await getFoodItemById(foodItemId);
      console.log("Food item data:", foodItem);
      setFoodItems(prev => ({
        ...prev,
        [foodItemId]: foodItem
      }));
      return foodItem;
    } catch (error) {
      console.error(`Error fetching food item ${foodItemId}:`, error);
      return null;
    }
  };

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
    
    // Prepara i contenuti della bag con i nomi reali dei food items se disponibili
    const contents = bag.content && Array.isArray(bag.content) 
      ? bag.content.map(item => {
          const foodItem = foodItems[item.FoodItemID];
          return {
            item: foodItem ? foodItem.Name : `FoodItem ID ${item.FoodItemID}`,
            quantity: item.Quantity
          };
        })
      : [];
    
    // Ottieni il nome dell'establishment se disponibile
    const establishment = establishments[bag.establishmentId];
    const establishmentName = establishment ? establishment.Name : `Establishment ID ${bag.establishmentId}`;
    
    return {
      id: bag.id,
      type: bag.type,
      size: sizeText,
      price: bag.price,
      establishment: establishmentName,
      pickupTimeRange: pickupTimeRange,
      status: bag.state.toLowerCase(),
      contents: contents,
      // Aggiungiamo i dati originali per quando abbiamo bisogno di accedervi
      originalData: bag
    };
  };

  // Funzione per caricare e trasformare tutte le bags
  const fetchAndTransformBags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ottieni tutte le bags dal server
      const bagsData = await getAllBags();
      
      // Carica i dati degli establishment per ogni bag
      const uniqueEstablishmentIds = [...new Set(
        bagsData
          .map(bag => bag.establishmentId)
          .filter(id => id !== undefined && id !== null)
      )];
      
      for (const id of uniqueEstablishmentIds) {
        if (!establishments[id]) {
          await fetchEstablishmentData(id);
        }
      }
      
      // Carica i dati dei food items per ogni bag
      const uniqueFoodItemIds = new Set();
      bagsData.forEach(bag => {
        if (bag.content && Array.isArray(bag.content)) {
          bag.content.forEach(item => {
            if (item.FoodItemID && !foodItems[item.FoodItemID]) {
              uniqueFoodItemIds.add(item.FoodItemID);
            }
          });
        }
      });
      
      for (const id of uniqueFoodItemIds) {
        await fetchFoodItemData(id);
      }
      
      // Filtra le bags per mostrare solo quelle future
      const now = dayjs();
      const filteredBags = bagsData.filter(bag => {
        if (!bag.timeToPickUp) return false;
        
        let bagDate;
        if (bag.timeToPickUp.includes("T")) {
          bagDate = dayjs(bag.timeToPickUp);
        } else {
          bagDate = dayjs(bag.timeToPickUp.replace(" ", "T"));
        }
        
        return bagDate.isAfter(now);
      });
      
      // Trasforma i dati delle bags nel formato corretto
      const transformedBags = filteredBags.map(bag => transformBagData(bag));
      setBags(transformedBags);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bags:", error);
      setError("Si è verificato un errore durante il caricamento delle bags. Riprova più tardi.");
      setLoading(false);
    }
  };

  // Carica i dati all'inizializzazione
  useEffect(() => {
    fetchAndTransformBags();
  }, []);

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
  
  // Funzione per gestire la richiesta di eliminazione di una bag
  const handleDeleteBag = (bag) => {
    setBagToDelete(bag);
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };
  
  // Funzione per confermare ed eseguire l'eliminazione con API
  const confirmDeleteBag = async () => {
    if (!bagToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log('Deleting bag with ID:', bagToDelete.id);
      
      // Chiama l'API per eliminare la bag
      const result = await deleteBag(bagToDelete.id);
      
      console.log('Bag deleted successfully:', result);
      
      // Ricarica tutte le bags per aggiornare la lista
      await fetchAndTransformBags();
      
      // Chiudi il modal di conferma
      setShowDeleteConfirm(false);
      setBagToDelete(null);
      setIsDeleting(false);
      
    } catch (error) {
      console.error('Error deleting bag:', error);
      setDeleteError(error.message || 'Si è verificato un errore durante l\'eliminazione della bag.');
      setIsDeleting(false);
      // Non chiudiamo il modal in caso di errore, così l'utente può vedere il messaggio
    }
  };
  
  // Funzione per aggiungere una nuova bag
  const handleAddBag = async (newBag) => {
    try {
      // Dopo che la bag è stata creata con successo, 
      // ricarica tutte le bags usando la stessa logica dell'useEffect
      await fetchAndTransformBags();
      console.log('Lista bags aggiornata dopo creazione');
    } catch (error) {
      console.error('Errore durante il refresh della lista bags:', error);
      // Fallback: prova a trasformare e aggiungere la bag localmente
      try {
        const transformedNewBag = transformBagData(newBag);
        setBags(prevBags => [...prevBags, transformedNewBag]);
      } catch (transformError) {
        console.error('Errore nella trasformazione della bag:', transformError);
      }
    }
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
        
        {/* Mostra messaggio di caricamento o errore */}
        {loading && <div className="text-center my-5">Caricamento bags in corso...</div>}
        {error && <div className="alert alert-danger my-5">{error}</div>}
        
        {/* Modal per la conferma di eliminazione */}
        <Modal 
          show={showDeleteConfirm} 
          onHide={() => setShowDeleteConfirm(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Conferma Eliminazione</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {deleteError && (
              <div className="alert alert-danger mb-3">
                <strong>Errore:</strong> {deleteError}
              </div>
            )}
            
            <p>Sei sicuro di voler eliminare questa bag?</p>
            {bagToDelete && (
              <div className="mt-2 p-3 bg-light rounded">
                <strong>Stabilimento:</strong> {bagToDelete.establishment}<br />
                <strong>Tipo:</strong> {bagToDelete.type === 'surprise' ? 'Surprise' : 'Regular'}<br />
                <strong>Dimensione:</strong> {bagToDelete.size}<br />
                <strong>Prezzo:</strong> ${Number(bagToDelete.price).toFixed(2)}<br />
                <strong>Pickup:</strong> {bagToDelete.pickupTimeRange}
              </div>
            )}
            <p className="text-danger mt-3 mb-0">
              <strong>Attenzione:</strong> Questa azione eliminerà definitivamente la bag e tutti i dati correlati (contenuti, prenotazioni, ecc.). L'operazione non può essere annullata.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Annulla
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDeleteBag}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Eliminando...
                </>
              ) : (
                'Elimina Definitivamente'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        
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
        
        {/* Mostra le bags solo se non c'è errore e il caricamento è completato */}
        {!loading && !error && (
          <BagsList 
            bags={bags} 
            onEditBag={handleEditBag} 
            onDeleteBag={handleDeleteBag} 
          />
        )}
      </Container>
    </>
  );
}

export default BagsPage;