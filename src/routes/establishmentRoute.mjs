import express from 'express';
import * as establishmentController from '../controllers/establishmentController.mjs';
import * as establishmentBagController from '../controllers/establishmentBagController.mjs';

const router = express.Router();

// Middleware to handle JSON parsing errors
const handleJsonErrors = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON parsing error:', err.message);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
    next();
};

// Apply the middleware to this router
router.use(handleJsonErrors);

// Route per gli establishment
router.get('/', establishmentController.fetchAllEstablishments);            // Recupera tutti gli establishment
router.get('/:id', establishmentController.fetchEstablishmentById);         // Recupera un singolo establishment per ID
router.post('/', establishmentController.createEstablishment);              // Crea un nuovo establishment
router.put('/:id', establishmentController.updateEstablishment);            // Aggiorna un establishment esistente
router.delete('/:id', establishmentController.deleteEstablishment);         // Elimina un establishment

// Route per i bags degli establishment
// La route con i filtri deve essere gestita nello stesso handler della route principale dei bags
// Il controller fetchBagsByEstablishment gestirà entrambi i casi (con e senza parametri di query)
router.get('/:establishmentId/bags', (req, res) => {
    // Se ci sono parametri di query startDate e endDate, utilizza il controller per il filtro date
    if (req.query.startDate && req.query.endDate) {
        return establishmentBagController.fetchBagsByEstablishmentAndDateRange(req, res);
    }
    // Altrimenti, utilizza il controller standard
    return establishmentBagController.fetchBagsByEstablishment(req, res);
});

// Route per i bags disponibili di un establishment
router.get('/:establishmentId/bags/available', establishmentBagController.fetchAvailableBagsByEstablishment);

export default router;