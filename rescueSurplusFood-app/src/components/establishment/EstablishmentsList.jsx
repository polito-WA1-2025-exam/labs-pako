import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import EstablishmentCard from './EstablishmentCard';
import EstablishmentForm from './EstablishmentForm';
import { getAllEstablishments, deleteEstablishment } from '../../API.mjs';

function EstablishmentsList() {
  // Stato per memorizzare gli establishment recuperati dall'API
  const [apiEstablishments, setApiEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Stato per tenere traccia dell'establishment da modificare
  const [establishmentToEdit, setEstablishmentToEdit] = useState(null);
  // Stato per mostrare il messaggio di successo dell'eliminazione
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Funzione per caricare gli establishment dal server
  const fetchEstablishments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEstablishments();
      setApiEstablishments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch establishments');
    } finally {
      setLoading(false);
    }
  };

  // Effetto per caricare gli establishment all'avvio del componente
  useEffect(() => {
    fetchEstablishments();
  }, []);

  // Funzione per aggiungere un nuovo establishment e ricaricare la lista
  const handleAddEstablishment = async (newEstablishment) => {
    console.log('New establishment added:', newEstablishment);
    
    // Ricarica tutti gli establishment dal server per assicurarsi che client e server siano sincronizzati
    await fetchEstablishments();
  };

  // Funzione per aggiornare un establishment esistente e ricaricare la lista
  const handleUpdateEstablishment = async (updatedEstablishment) => {
    console.log('Establishment updated:', updatedEstablishment);
    
    // Ricarica tutti gli establishment dal server
    await fetchEstablishments();
    
    // Reset establishment da modificare
    setEstablishmentToEdit(null);
  };

  // Funzione per eliminare un establishment e ricaricare la lista
  const handleDeleteEstablishment = async (id) => {
    try {
      await deleteEstablishment(id);
      
      // Ricarica gli establishment aggiornati dal server
      await fetchEstablishments();
      
      // Mostra il messaggio di successo
      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      
      // Se stiamo modificando l'establishment che è stato eliminato, annulla la modifica
      if (establishmentToEdit && establishmentToEdit.id === id) {
        setEstablishmentToEdit(null);
      }
    } catch (err) {
      setError('Failed to delete establishment. Please try again.');
      console.error('Error deleting establishment:', err);
    }
  };

  // Funzione per impostare un establishment da modificare
  const handleEditEstablishment = (id) => {
    const estToEdit = apiEstablishments.find(est => est.id === id);
    if (estToEdit) {
      setEstablishmentToEdit(estToEdit);
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
    cuisineType: est.category ? (est.type ? `${est.category} - ${est.type}` : est.category) : 'N/A',
    address: est.address,
    phone: est.phoneNumber,
    description: est.content
  }));

  if (loading && apiEstablishments.length === 0) {
    return <p>Loading establishments...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h1>Participating Establishments</h1>
      <p>Browse our partners who are committed to reducing food waste. All establishments are displayed in alphabetical order.</p>
      
      {deleteSuccess && (
        <Alert variant="success" onClose={() => setDeleteSuccess(false)} dismissible>
          Establishment deleted successfully!
        </Alert>
      )}
      
      {/* Form section first for better UX */}
      <section id="establishment-form-section" className="mt-4 mb-5">
        <h2>{establishmentToEdit ? 'Edit Establishment' : 'Add New Establishment'}</h2>
        <EstablishmentForm
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
          establishmentToEdit={establishmentToEdit}
          onCancelEdit={handleCancelEdit}
        />
      </section>
      
      {/* Display establishments */}
      <h2>Current Establishments</h2>
      {loading && <p>Refreshing establishments list...</p>}
      
      {apiEstablishments.length === 0 && !loading ? (
        <Alert variant="info">
          No establishments found. Use the form above to add a new establishment.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {establishments.map(establishment => (
            <Col key={establishment.id}>
              <EstablishmentCard
                establishment={establishment}
                onEdit={() => handleEditEstablishment(establishment.id)}
                onDelete={() => handleDeleteEstablishment(establishment.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default EstablishmentsList;