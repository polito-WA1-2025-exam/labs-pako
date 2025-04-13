import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import EstablishmentCard from './EstablishmentCard';
import EstablishmentForm from './EstablishmentForm';

function EstablishmentsList() {
  // Dati iniziali degli establishment
  const initialEstablishments = [
    {
      "id": 1,
      "name": "Green Grocers",
      "address": "123 Main St, Springfield",
      "phoneNumber": "555-1234",
      "category": "Grocery",
      "type": "Supermarket",
      "bags": [],
      "content": "Ampia selezione di prodotti freschi, latticini e pane appena sfornato. Offerte speciali sui prodotti locali ogni settimana."
    },
    {
      "id": 2,
      "name": "Fresh Mart",
      "address": "456 Elm St, Springfield",
      "phoneNumber": "555-5678",
      "category": "Grocery",
      "type": "Convenience Store",
      "bags": [],
      "content": "Il tuo negozio di fiducia per acquisti veloci. Trova snack, bevande, articoli per la casa e una piccola selezione di frutta e verdura fresca."
    },
    {
      "id": 3,
      "name": "Organic Heaven",
      "address": "789 Oak St, Springfield",
      "phoneNumber": "555-9101",
      "category": "Grocery",
      "type": "Organic Store",
      "bags": [],
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
      "bags": [],
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
      "bags": [],
      "content": "Mercato agricolo con prodotti freschi locali, frutta e verdura di stagione, formaggi artigianali e altri prodotti alimentari di piccoli produttori. Un'esperienza di shopping all'insegna della gioia."
    }
  ];
  
  // Stato per memorizzare gli establishment
  const [apiEstablishments, setApiEstablishments] = useState(initialEstablishments);
  
  // Stato per tenere traccia dell'establishment da modificare
  const [establishmentToEdit, setEstablishmentToEdit] = useState(null);
  
  // Stato per mostrare il messaggio di successo dell'eliminazione
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Funzione per aggiungere un nuovo establishment
  const handleAddEstablishment = (newEstablishment) => {
    setApiEstablishments([...apiEstablishments, newEstablishment]);
  };
  
  // Funzione per aggiornare un establishment esistente
  const handleUpdateEstablishment = (updatedEstablishment) => {
    setApiEstablishments(
      apiEstablishments.map(est => 
        est.id === updatedEstablishment.id ? updatedEstablishment : est
      )
    );
    // Reset dell'establishment da modificare
    setEstablishmentToEdit(null);
  };
  
  // Funzione per eliminare un establishment
  const handleDeleteEstablishment = (id) => {
    // Filtriamo gli establishment per rimuovere quello con l'id corrispondente
    setApiEstablishments(
      apiEstablishments.filter(est => est.id !== id)
    );
    
    // Mostriamo un messaggio di conferma dell'eliminazione
    setDeleteSuccess(true);
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
    
    // Se stiamo eliminando l'establishment che stavamo modificando, resettiamo lo stato
    if (establishmentToEdit && establishmentToEdit.id === id) {
      setEstablishmentToEdit(null);
    }
  };
  
  // Funzione per impostare un establishment da modificare
  const handleEditEstablishment = (id) => {
    const estToEdit = apiEstablishments.find(est => est.id === id);
    if (estToEdit) {
      setEstablishmentToEdit(estToEdit);
      // Scorriamo la pagina fino al form
      setTimeout(() => {
        document.getElementById('establishment-form-section').scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
    }
  };
  
  // Funzione per annullare la modifica
  const handleCancelEdit = () => {
    setEstablishmentToEdit(null);
  };
  
  // Trasformiamo lo stato degli establishment nel formato che EstablishmentCard si aspetta
  const establishments = apiEstablishments.map(est => ({
    id: est.id,
    name: est.name,
    cuisineType: est.category || est.type || 'N/A',
    address: est.address,
    phone: est.phoneNumber,
    description: est.content
  }));
  
  return (
    <Container>
      <h2 className="page-title">Participating Establishments</h2>
      <p className="mb-4">Browse our partners who are committed to reducing food waste. All establishments are displayed in alphabetical order.</p>
      
      {deleteSuccess && (
        <Alert variant="success" onClose={() => setDeleteSuccess(false)} dismissible>
          Establishment deleted successfully!
        </Alert>
      )}
      
      <Row xs={1} md={2} lg={3} className="g-4 mb-5">
        {establishments.map(establishment => (
          <Col key={establishment.id}>
            <EstablishmentCard 
              establishment={establishment} 
              onEdit={handleEditEstablishment}
              onDelete={handleDeleteEstablishment}
            />
          </Col>
        ))}
      </Row>
      
      {/* Aggiungiamo un ID per poter scorrere fino a questo punto quando si fa clic su Edit */}
      <div id="establishment-form-section">
        <EstablishmentForm 
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
          establishmentToEdit={establishmentToEdit}
          onCancelEdit={handleCancelEdit}
        />
      </div>
    </Container>
  );
}

export default EstablishmentsList;