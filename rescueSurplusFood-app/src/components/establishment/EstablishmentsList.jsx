import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import EstablishmentCard from './EstablishmentCard';
import EstablishmentForm from './EstablishmentForm';
import { getAllEstablishments } from '../../API.mjs'; // Importa la funzione API

function EstablishmentsList() {
  // Stato per memorizzare gli establishment recuperati dall'API
  const [apiEstablishments, setApiEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stato per tenere traccia dell'establishment da modificare
  const [establishmentToEdit, setEstablishmentToEdit] = useState(null);

  // Stato per mostrare il messaggio di successo dell'eliminazione
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Effetto per caricare gli establishment all'avvio del componente
  useEffect(() => {
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

    fetchEstablishments();
  }, []);

  // Funzione per aggiungere un nuovo establishment (da implementare con API POST)
  const handleAddEstablishment = (newEstablishment) => {
    console.log('handleAddEstablishment:', newEstablishment);
    // setApiEstablishments([...apiEstablishments, newEstablishment]);
  };

  // Funzione per aggiornare un establishment esistente (da implementare con API PATCH)
  const handleUpdateEstablishment = (updatedEstablishment) => {
    console.log('handleUpdateEstablishment:', updatedEstablishment);
    // setApiEstablishments(
    //   apiEstablishments.map(est =>
    //     est.id === updatedEstablishment.id ? updatedEstablishment : est
    //   )
    // );
    // setEstablishmentToEdit(null);
  };

  // Funzione per eliminare un establishment (da implementare con API DELETE)
  const handleDeleteEstablishment = (id) => {
    console.log('handleDeleteEstablishment:', id);
    // setApiEstablishments(
    //   apiEstablishments.filter(est => est.id !== id)
    // );
    // setDeleteSuccess(true);
    // setTimeout(() => {
    //   setDeleteSuccess(false);
    // }, 3000);
    // if (establishmentToEdit && establishmentToEdit.id === id) {
    //   setEstablishmentToEdit(null);
    // }
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
    cuisineType: est.category || est.type || 'N/A',
    address: est.address,
    phone: est.phoneNumber,
    description: est.content
  }));

  if (loading) {
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
      <Row xs={1} md={2} lg={3} className="g-4">
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
      <section id="establishment-form-section" className="mt-4">
        <h2>{establishmentToEdit ? 'Edit Establishment' : 'Add New Establishment'}</h2>
        <EstablishmentForm
          initialEstablishment={establishmentToEdit}
          onSave={establishmentToEdit ? handleUpdateEstablishment : handleAddEstablishment}
          onCancel={handleCancelEdit}
        />
      </section>
    </Container>
  );
}

export default EstablishmentsList;