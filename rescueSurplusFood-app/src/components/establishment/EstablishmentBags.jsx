import React, { useState, useEffect } from 'react';
import { Badge, Button, ListGroup, Spinner, Alert, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { deleteBag } from '../../API.mjs';
import dayjs from 'dayjs';

function EstablishmentBags({ establishmentId }) {
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  
  // Stati per il modal di conferma eliminazione
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bagToDelete, setBagToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Funzione per caricare le bags dell'establishment
  const fetchBagsByEstablishment = async () => {
    if (!establishmentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Utilizziamo l'API dedicata per ottenere le borse di un establishment
      const response = await fetch(`http://localhost:3002/api/establishments/${establishmentId}/bags`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bags for establishment ID ${establishmentId}`);
      }
      
      const bagsData = await response.json();
      console.log(bagsData);
      
      // Filtriamo solo le borse con pickup time nel futuro
      const now = dayjs();
      const filteredBags = bagsData.filter(bag => {
        if (!bag.timeToPickUp) return false;
        
        const pickupTime = dayjs(bag.timeToPickUp);
        return pickupTime.isValid() && pickupTime.isAfter(now);
      });
      
      setBags(filteredBags);
    } catch (err) {
      console.error("Error fetching bags:", err);
      setError(err.message || "Failed to load bags for this establishment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBagsByEstablishment();
  }, [establishmentId]);

  // Funzione per gestire l'aggiunta al carrello
  const handleAddToCart = async () => {
    try {
        setIsAdding(true);
        
        // Qui puoi anche chiamare direttamente createReservation se preferisci
        // const userId = getCurrentUserId(); // Implementa questa funzione
        // await createReservation(userId, bag.id);
        
        await addToCart(bag);
        setIsAdding(false);
        
        // Opzionale: mostra un messaggio di successo
        alert('Bag added to cart and reserved successfully!');
        
    } catch (error) {
        setIsAdding(false);
        console.error("Failed to add bag to cart:", error);
        
        // Mostra un messaggio di errore all'utente
        alert('Failed to add bag to cart. Please try again.');
    }
};


  // Funzione per gestire la richiesta di eliminazione
  const handleDeleteBag = (bag) => {
    setBagToDelete(bag);
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  // Funzione per confermare ed eseguire l'eliminazione
  const confirmDeleteBag = async () => {
    if (!bagToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      console.log('Deleting bag with ID:', bagToDelete.id);
      
      // Chiama l'API per eliminare la bag
      const result = await deleteBag(bagToDelete.id);
      
      console.log('Bag deleted successfully:', result);
      
      // Ricarica le bags per aggiornare la lista
      await fetchBagsByEstablishment();
      
      // Chiudi il modal di conferma
      setShowDeleteConfirm(false);
      setBagToDelete(null);
      setIsDeleting(false);
      
    } catch (error) {
      console.error('Error deleting bag:', error);
      setDeleteError(error.message || 'Si è verificato un errore durante l\'eliminazione della bag.');
      setIsDeleting(false);
    }
  };

  // Helper function to render content item safely
  const renderContentItem = (item) => {
    // Check if item is an object with specific keys
    if (item && typeof item === 'object') {
      // If it's an object with known keys, display the appropriate values
      if (item.name) {
        return `${item.name}${item.quantity ? ` (${item.quantity})` : ''}`;
      } else if (item.FoodItemID) {
        // Handle the object with BagID, FoodItemID, Quantity
        return `Item #${item.FoodItemID}${item.Quantity ? ` (${item.Quantity})` : ''}`;
      } else {
        // For other unknown objects, show a generic label
        return "Item";
      }
    }
    // If it's a string or number, render directly
    return String(item);
  };

  // Se sta caricando, mostra lo spinner
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading bags...</span>
        </Spinner>
      </div>
    );
  }

  // Se c'è un errore, mostra un messaggio di errore
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error loading bags</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchBagsByEstablishment}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="establishment-bags">
      <h3 className="mb-3">Available Bags</h3>
      
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
              <strong>Tipo:</strong> {bagToDelete.type === 'surprise' ? 'Surprise Bag' : 'Regular Bag'}<br />
              <strong>Dimensione:</strong> {bagToDelete.size === 0 ? "Small" : bagToDelete.size === 1 ? "Medium" : "Large"}<br />
              <strong>Prezzo:</strong> ${bagToDelete.price && bagToDelete.price.toFixed(2)}<br />
              <strong>Pickup:</strong> {formatPickupTime(bagToDelete.timeToPickUp)}
            </div>
          )}
          <p className="text-danger mt-3 mb-0">
            <strong>Attenzione:</strong> Questa azione eliminerà definitivamente la bag e tutti i dati correlati. L'operazione non può essere annullata.
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

      {bags && bags.length > 0 ? (
        <ListGroup>
          {bags.map(bag => (
            <ListGroup.Item key={bag.id} className="mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="me-auto">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="mb-0 me-2">
                      {bag.type === "surprise" ? "Surprise Bag" : "Regular Bag"}
                    </h5>
                    <Badge bg={bag.type === "surprise" ? "warning" : "success"}>
                      {bag.size === 0 ? "Small" : bag.size === 1 ? "Medium" : "Large"}
                    </Badge>
                  </div>
                  
                  {bag.type === "regular" && bag.content && Array.isArray(bag.content) && bag.content.length > 0 && (
                    <div className="mt-2">
                      <h6>Contents:</h6>
                      <ul className="ps-3 mb-2">
                        {bag.content.map((item, index) => (
                          <li key={index}>
                            {renderContentItem(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="mb-1">
                    <strong>Pickup Time:</strong> {formatPickupTime(bag.timeToPickUp)}
                  </p>
                </div>
                
                <div className="text-end">
                  <h4 className="text-primary mb-3">${bag.price && bag.price.toFixed(2)}</h4>
                  <div className="d-flex flex-column gap-2">
                    <Button 
                      variant="primary" 
                      onClick={() => handleAddToCart(bag)}
                      disabled={bag.state !== "available"}
                    >
                      Add to Cart
                    </Button>
                    {bag.state === "available" && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteBag(bag)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>No bags are currently available from this establishment.</p>
      )}
    </div>
  );
}

// Funzione per formattare il pickup time in un formato leggibile
function formatPickupTime(timeString) {
  if (!timeString) return "Not specified";
  
  const time = dayjs(timeString);
  if (!time.isValid()) return timeString;
  
  return time.format("MMM D, YYYY h:mm A");
}

export default EstablishmentBags;