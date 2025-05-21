import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
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
  // Stato per tenere traccia delle operazioni di eliminazione in corso
  const [deletingId, setDeletingId] = useState(null);

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
  // Funzione migliorata per la gestione dell'eliminazione
  const handleDeleteEstablishment = async (id) => {
    // Impostiamo l'ID dell'establishment che stiamo eliminando
    setDeletingId(id);
    setError(null); // Cancella eventuali errori precedenti
    
    try {
      console.log(`Iniziando eliminazione dell'establishment ID: ${id}`);
      
      // Prova a recuperare l'establishment prima di eliminarlo, per verificare che esista
      try {
        const existingEstablishments = await getAllEstablishments();
        const establishmentExists = existingEstablishments.some(est => est.id === parseInt(id) || est.id === id);
        
        if (!establishmentExists) {
          console.warn(`Tentativo di eliminare un establishment che non esiste: ${id}`);
          throw new Error(`L'establishment con ID ${id} non esiste o è già stato eliminato.`);
        }
      } catch (checkError) {
        // Se fallisce il controllo di esistenza, continuiamo comunque con l'eliminazione
        console.warn(`Impossibile verificare l'esistenza dell'establishment ${id}:`, checkError);
      }
      
      // Chiamata all'API per eliminare l'establishment
      await deleteEstablishment(id);
      
      // Mostra il messaggio di successo
      setDeleteSuccess(true);
      console.log(`Establishment ${id} eliminato con successo`);
      setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      
      // Ricarica gli establishment aggiornati dal server
      console.log("Ricaricamento della lista degli establishment dopo eliminazione");
      await fetchEstablishments();
      
      // Se stiamo modificando l'establishment che è stato eliminato, annulla la modifica
      if (establishmentToEdit && (establishmentToEdit.id === id || establishmentToEdit.id === parseInt(id))) {
        console.log("Annullamento della modifica dell'establishment eliminato");
        setEstablishmentToEdit(null);
      }
    } catch (err) {
      // Gestione migliorata degli errori con messaggi più specifici per l'utente
      console.error(`Errore durante l'eliminazione dell'establishment ${id}:`, err);
      
      let userFriendlyMessage = "";
      
      // Analizza il messaggio di errore per fornire feedback più utile
      const errorMsg = err.message?.toLowerCase() || '';
      
      if (errorMsg.includes('500') || errorMsg.includes('server error')) {
        userFriendlyMessage = `Errore interno del server durante l'eliminazione dell'establishment ${id}. Questo potrebbe essere dovuto a:
        - L'establishment è referenziato da altri dati (come recensioni o offerte)
        - Un vincolo di integrità del database
        - Un errore temporaneo del server
        
        Si prega di riprovare più tardi o contattare l'amministratore.`;
      } else if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('non esiste')) {
        userFriendlyMessage = `L'establishment ${id} non è stato trovato. Potrebbe essere già stato eliminato o non esiste nel database.`;
      } else if (errorMsg.includes('403') || errorMsg.includes('permission') || errorMsg.includes('permesso')) {
        userFriendlyMessage = `Non hai i permessi necessari per eliminare l'establishment ${id}. Contatta l'amministratore se ritieni che si tratti di un errore.`;
      } else if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
        userFriendlyMessage = `La richiesta di eliminazione è scaduta. Il server potrebbe essere sovraccarico o non raggiungibile. Si prega di riprovare più tardi.`;
      } else {
        userFriendlyMessage = `Impossibile eliminare l'establishment ${id}: ${err.message}. Si prega di riprovare o contattare l'assistenza.`;
      }
      
      setError(userFriendlyMessage);
      
      // Rimuovi il messaggio di errore dopo un periodo più lungo per dare tempo all'utente di leggerlo
      setTimeout(() => {
        setError(null);
      }, 10000);
      
      // Ricarichiamo comunque la lista per assicurarci che sia aggiornata
      try {
        await fetchEstablishments();
      } catch (refreshError) {
        console.warn("Impossibile ricaricare la lista dopo un errore di eliminazione:", refreshError);
      }
    } finally {
      // Ripristina lo stato di eliminazione
      setDeletingId(null);
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
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading establishments...</span>
        </Spinner>
        <p className="mt-2">Loading establishments...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Participating Establishments</h1>
      <p>Browse our partners who are committed to reducing food waste. All establishments are displayed in alphabetical order.</p>
      
      {/* Mostra l'alert di successo se un establishment è stato eliminato */}
      {deleteSuccess && (
        <Alert variant="success" onClose={() => setDeleteSuccess(false)} dismissible>
          <i className="bi bi-check-circle-fill me-2"></i>
          Establishment deleted successfully!
        </Alert>
      )}
      
      {/* Mostra l'alert di errore se c'è stato un problema */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
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
      {loading && apiEstablishments.length > 0 && (
        <Alert variant="info">
          <Spinner animation="border" size="sm" className="me-2" />
          Refreshing establishments list...
        </Alert>
      )}
      
      {apiEstablishments.length === 0 && !loading ? (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
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
                isDeleting={deletingId === establishment.id}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default EstablishmentsList;