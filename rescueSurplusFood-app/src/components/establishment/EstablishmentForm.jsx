import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Col, Row } from 'react-bootstrap';
import { createEstablishment, updateEstablishment } from '../../API.mjs';

function EstablishmentForm({ onAddEstablishment, onUpdateEstablishment, establishmentToEdit, onCancelEdit }) {
  // Stati per i campi del form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState(null);
  
  // Stati per gli errori di validazione
  const [errors, setErrors] = useState({});
  // Stato per mostrare il messaggio di successo
  const [showSuccess, setShowSuccess] = useState(false);
  // Stato per la gestione del caricamento
  const [loading, setLoading] = useState(false);
  // Stato per gli errori API
  const [apiError, setApiError] = useState(null);
  // Stato per tracciare se siamo in modalità di modifica
  const [isEditing, setIsEditing] = useState(false);
  // Categorie predefinite per il dropdown
  const categories = ['Grocery', 'Restaurant', 'Bakery', 'Café', 'Market'];
  
  // Tipi predefiniti per ciascuna categoria
  const typeOptions = {
    'Grocery': ['Supermarket', 'Convenience Store', 'Organic Store'],
    'Restaurant': ['Italian', 'Indian', 'Pizzeria', 'Fast Food', 'Vegan'],
    'Bakery': ['Artisan', 'Pastry Shop', 'Bread Specialty'],
    'Café': ['Specialty Coffee', 'Brunch Place', 'Tea House'],
    'Market': ['Farmers Market', 'Delicatessen', 'Fish Market', 'Butcher Shop']
  };
  
  // Aggiorniamo il form quando viene passato un establishment da modificare
  useEffect(() => {
    if (establishmentToEdit) {
      setName(establishmentToEdit.name || '');
      setCategory(establishmentToEdit.category || '');
      setType(establishmentToEdit.type || '');
      setAddress(establishmentToEdit.address || '');
      setPhoneNumber(establishmentToEdit.phoneNumber || '');
      setContent(establishmentToEdit.content || '');
      setId(establishmentToEdit.id);
      setIsEditing(true);
      // Reset degli errori se presenti
      setErrors({});
      setApiError(null);
    } else {
      // Se non c'è un establishment da modificare, resettiamo il form
      resetForm();
      setIsEditing(false);
    }
  }, [establishmentToEdit]);
  
  // Funzione per resettare il form
  const resetForm = () => {
    setName('');
    setCategory('');
    setType('');
    setAddress('');
    setPhoneNumber('');
    setContent('');
    setId(null);
    setErrors({});
    setApiError(null);
  };
  
  // Funzione di validazione
  const validateForm = () => {
    const newErrors = {};
    
    // Validazione nome
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    // Validazione categoria
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    // Validazione tipo
    if (!type) {
      newErrors.type = 'Please select a type';
    }
    
    // Validazione indirizzo
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    } else if (address.length < 5) {
      newErrors.address = 'Please enter a valid address';
    }
    
    // Validazione numero di telefono (formato semplice)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    // Validazione descrizione
    if (!content.trim()) {
      newErrors.content = 'Description is required';
    } else if (content.length < 20) {
      newErrors.content = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Gestione del cambio di categoria
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setType(''); // Reset del tipo quando cambia la categoria
  };
  
  // Gestione dell'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    // Validazione del form
    if (validateForm()) {
      setLoading(true);
      
      try {
        if (isEditing && id) {
          // Prepara i dati per l'aggiornamento
          const establishmentData = {
            name,
            category,
            type,
            address,
            phoneNumber,
            content
          };
          
          // Chiama l'API per aggiornare l'establishment
          const updatedEstablishment = await updateEstablishment(id, establishmentData);
          
          // Invio dell'establishment aggiornato al componente padre
          if (typeof onUpdateEstablishment === 'function') {
            onUpdateEstablishment(updatedEstablishment);
          } else {
            console.warn('onUpdateEstablishment is not a function');
          }
          
          // Mostra messaggio di successo
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            // Reset del form e della modalità di modifica
            resetForm();
            setIsEditing(false);
          }, 3000);
        } else {
          // Prepara i dati per la creazione
          const establishmentData = {
            name,
            category,
            type,
            address,
            phoneNumber,
            content
          };
          
          // Chiama l'API per creare un nuovo establishment
          const newEstablishment = await createEstablishment(establishmentData);
          
          // Invio del nuovo establishment al componente padre
          if (typeof onAddEstablishment === 'function') {
            onAddEstablishment(newEstablishment);
          } else {
            console.warn('onAddEstablishment is not a function');
            // Show success even if callback is missing
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }
          
          // Reset del form
          resetForm();
          
          // Mostra messaggio di successo
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      } catch (error) {
        console.error('Error submitting establishment:', error);
        setApiError('An error occurred while saving the establishment. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Gestione dell'annullamento della modifica
  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };
  
  return (
    <Card className="mb-4">
      <Card.Header as="h5">
        {isEditing ? 'Edit Establishment' : 'Add New Establishment'}
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            {isEditing 
              ? 'Establishment updated successfully!' 
              : 'Establishment added successfully!'}
          </Alert>
        )}
        
        {apiError && (
          <Alert variant="danger" onClose={() => setApiError(null)} dismissible>
            {apiError}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter establishment name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!errors.name}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={handleCategoryChange}
                  isInvalid={!!errors.category}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={!category || loading}
                  isInvalid={!!errors.type}
                >
                  <option value="">Select Type</option>
                  {category && typeOptions[category]?.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={!!errors.address}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  isInvalid={!!errors.phoneNumber}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter establishment description"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              isInvalid={!!errors.content}
              disabled={loading}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            {isEditing && (
              <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            )}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Establishment' : 'Add Establishment'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default EstablishmentForm;