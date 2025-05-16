import express from 'express';
import * as establishmentController from '../controllers/establishmentController.mjs';
import * as establishmentBagController from '../controllers/establishmentBagController.mjs';

const router = express.Router();

// Route esistenti per gli establishment
router.get('/', establishmentController.fetchAllEstablishments);  // Recupera tutti gli establishment
router.get('/:id', establishmentController.fetchEstablishmentById); // Recupera un singolo establishment per ID

// Nuove route per i bags degli establishment
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