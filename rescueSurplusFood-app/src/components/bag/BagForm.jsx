import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';

function BagForm({ onAddBag, onUpdateBag, bagToEdit = null, establishments = [] }) {
  // Stato iniziale del form
  const initialFormState = {
    type: 'regular',
    size: '',
    price: '',
    establishmentId: '',
    timeToPickUp: '',
    content: [{ foodItemId: '', quantity: 1 }]
  };

  // Stati per gestire i dati del form
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Effetto per popolare il form quando viene passata una bag da modificare
  useEffect(() => {
    if (bagToEdit) {
      setIsEditMode(true);
      
      // Estrai i dati originali dalla bag (che viene passata con il formato trasformato)
      const original = bagToEdit.originalData;
      
      // Converti la dimensione numerica in stringa
      let sizeText = "";
      switch (original.size) {
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
          sizeText = "";
      }
      
      // Formatta l'orario di ritiro in formato datetime-local (YYYY-MM-DDThh:mm)
      const formattedTimeToPickUp = original.timeToPickUp ? 
        original.timeToPickUp.replace(' ', 'T') : 
        '';
      
      // Prepara i contenuti nel formato usato dal form
      const formattedContent = original.content.map(item => ({
        foodItemId: item.FoodItemID.toString(),
        quantity: item.Quantity
      }));
      
      // Popola il form con i dati della bag da modificare
      setFormData({
        id: original.id,
        type: original.type,
        size: sizeText,
        price: original.price.toString(),
        establishmentId: original.establishmentId.toString(),
        timeToPickUp: formattedTimeToPickUp,
        content: formattedContent.length > 0 ? formattedContent : [{ foodItemId: '', quantity: 1 }],
        state: original.state
      });
    } else {
      // Reset del form e dello stato di modifica
      setIsEditMode(false);
      setFormData(initialFormState);
    }
  }, [bagToEdit]);

  // Funzione per gestire i cambiamenti nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Funzione per gestire i cambiamenti nei campi del contenuto (per bag regolari)
  const handleContentChange = (index, field, value) => {
    const updatedContent = [...formData.content];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };
    setFormData(prevData => ({
      ...prevData,
      content: updatedContent
    }));
  };

  // Funzione per aggiungere un nuovo item al contenuto
  const addContentItem = () => {
    setFormData(prevData => ({
      ...prevData,
      content: [...prevData.content, { foodItemId: '', quantity: 1 }]
    }));
  };

  // Funzione per rimuovere un item dal contenuto
  const removeContentItem = (index) => {
    if (formData.content.length > 1) {
      const updatedContent = formData.content.filter((_, i) => i !== index);
      setFormData(prevData => ({
        ...prevData,
        content: updatedContent
      }));
    }
  };

  // Validazione del form
  const validateForm = () => {
    const newErrors = {};
    // Validazione tipo
    if (!formData.type) {
      newErrors.type = 'Tipo di borsa obbligatorio';
    }

    // Validazione dimensione
    if (!formData.size) {
      newErrors.size = 'Dimensione obbligatoria';
    }

    // Validazione prezzo
    if (!formData.price) {
      newErrors.price = 'Prezzo obbligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Il prezzo deve essere un numero positivo';
    }

    // Validazione stabilimento
    if (!formData.establishmentId) {
      newErrors.establishmentId = 'Stabilimento obbligatorio';
    }

    // Validazione orario di ritiro
    if (!formData.timeToPickUp) {
      newErrors.timeToPickUp = 'Orario di ritiro obbligatorio';
    } else {
      // Verifica che il ritiro sia nel futuro
      const pickupDateTime = dayjs(formData.timeToPickUp);
      const currentTime = dayjs();
      if (pickupDateTime.isBefore(currentTime, 'minute')) {
        newErrors.timeToPickUp = 'L\'orario di ritiro deve essere nel futuro';
      }
    }

    // Validazione contenuto per le borse di tipo regular
    if (formData.type === 'regular') {
      const contentErrors = [];
      let hasContentError = false;
      formData.content.forEach((item, index) => {
        const itemErrors = {};
        if (!item.foodItemId) {
          itemErrors.foodItemId = 'Alimento obbligatorio';
          hasContentError = true;
        }
        if (!item.quantity || item.quantity < 1) {
          itemErrors.quantity = 'Quantità deve essere almeno 1';
          hasContentError = true;
        }
        contentErrors[index] = itemErrors;
      });
      if (hasContentError) {
        newErrors.content = contentErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funzione di submit del form
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      // Formatta la data nel formato corretto (YYYY-MM-DD HH:MM)
      const formattedTimeToPickUp = formData.timeToPickUp
        ? formData.timeToPickUp.replace('T', ' ')
        : null;
      
      // Prepara i dati da inviare
      const bagData = {
        ...formData,
        timeToPickUp: dayjs(formData.timeToPickUp).format('YYYY-MM-DDTHH:mm'), // Data formattata correttamente
        // Se siamo in modalità modifica, mantieni l'ID esistente, altrimenti generane uno nuovo
        id: isEditMode ? formData.id : dayjs().valueOf(), // Usa dayjs per generare un timestamp
        state: isEditMode ? formData.state : 'available',
        userId: null,
        removedItems: [],
        creationDate: isEditMode 
          ? formData.creationDate 
          : dayjs().format('YYYY-MM-DD HH:mm') // Usa dayjs per formattare la data
      };
      
      // Converti la dimensione in formato numerico
      switch (bagData.size) {
        case 'small':
          bagData.size = 0;
          break;
        case 'medium':
          bagData.size = 1;
          break;
        case 'large':
          bagData.size = 2;
          break;
        default:
          bagData.size = 1; // Valore predefinito medium
      }
      
      // Trasforma il contenuto
      bagData.content = bagData.content.map(item => ({
        BagID: bagData.id,
        FoodItemID: parseInt(item.foodItemId),
        Quantity: parseInt(item.quantity)
      }));
      
      console.log('Dati della borsa inviati:', bagData);
      
      // In base alla modalità, chiama la funzione appropriata
      if (isEditMode) {
        onUpdateBag(bagData);
      } else {
        onAddBag(bagData);
      }
      
      // Reset del form e mostra messaggio di successo
      setFormData(initialFormState);
      setErrors({});
      setFormSubmitted(false);
      setShowSuccess(true);
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h4>{isEditMode ? 'Modifica Bag' : 'Aggiungi una Nuova Bag'}</h4>
      </Card.Header>
      <Card.Body>
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            {isEditMode ? 'Bag modificata con successo!' : 'Bag aggiunta con successo!'}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo di Bag</Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  isInvalid={formSubmitted && errors.type}
                  disabled={isEditMode} // In modalità modifica, non permettiamo di cambiare il tipo
                >
                  <option value="regular">Regular</option>
                  <option value="surprise">Surprise</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Dimensione</Form.Label>
                <Form.Select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  isInvalid={formSubmitted && errors.size}
                >
                  <option value="">Seleziona una dimensione</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.size}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  isInvalid={formSubmitted && errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stabilimento</Form.Label>
                <Form.Select
                  name="establishmentId"
                  value={formData.establishmentId}
                  onChange={handleChange}
                  isInvalid={formSubmitted && errors.establishmentId}
                >
                  <option value="">Seleziona uno stabilimento</option>
                  {/* Sostituisci con dati reali degli stabilimenti */}
                  <option value="1">Establishment 1</option>
                  <option value="2">Establishment 2</option>
                  <option value="3">Establishment 3</option>
                  <option value="4">Establishment 4</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.establishmentId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Data e Ora di Ritiro</Form.Label>
            <Form.Control
              type="datetime-local"
              name="timeToPickUp"
              value={formData.timeToPickUp}
              onChange={handleChange}
              isInvalid={formSubmitted && errors.timeToPickUp}
              min={dayjs().toISOString().slice(0, 16)} // Usa dayjs per ottenere il minimo
            />
            <Form.Control.Feedback type="invalid">
              {errors.timeToPickUp}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              L'orario di ritiro deve essere nel futuro.
            </Form.Text>
          </Form.Group>
          
          {formData.type === 'regular' && (
            <div className="content-items-container">
              <h5 className="mt-4 mb-3">Contenuto della Bag</h5>
              {formData.content.map((item, index) => (
                <div key={index} className="content-item mb-3 p-3 border rounded">
                  <Row>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Alimento</Form.Label>
                        <Form.Select
                          value={item.foodItemId}
                          onChange={(e) => handleContentChange(index, 'foodItemId', e.target.value)}
                          isInvalid={formSubmitted && errors.content && errors.content[index]?.foodItemId}
                        >
                          <option value="">Seleziona un alimento</option>
                          {/* Sostituisci con dati reali degli alimenti */}
                          <option value="1">Mela</option>
                          <option value="2">Banana</option>
                          <option value="3">Pane</option>
                          <option value="4">Pasta</option>
                          <option value="5">Verdure miste</option>
                          <option value="6">Yogurt</option>
                          <option value="7">Formaggio</option>
                          <option value="8">Cioccolato</option>
                          <option value="9">Biscotti</option>
                        </Form.Select>
                        {formSubmitted && errors.content && errors.content[index]?.foodItemId && (
                          <div className="invalid-feedback d-block">
                            {errors.content[index].foodItemId}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Quantità</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleContentChange(index, 'quantity', e.target.value)}
                          isInvalid={formSubmitted && errors.content && errors.content[index]?.quantity}
                        />
                        {formSubmitted && errors.content && errors.content[index]?.quantity && (
                          <div className="invalid-feedback d-block">
                            {errors.content[index].quantity}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end mb-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeContentItem(index)}
                        disabled={formData.content.length <= 1}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={addContentItem} 
                className="mt-2 mb-4"
              >
                <i className="bi bi-plus-circle me-1"></i> Aggiungi Alimento
              </Button>
            </div>
          )}
          
          <div className="d-grid mt-4">
            <Button type="submit" variant="primary">
              {isEditMode ? 'Aggiorna Bag' : 'Aggiungi Bag'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BagForm;