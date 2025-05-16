import establishmentBagService from '../queries/establishmentBagQueries.mjs';

// Controller per recuperare tutti i bags di un establishment specifico
export const fetchBagsByEstablishment = async (req, res) => {
    try {
        const establishmentId = req.params.establishmentId;
        
        // Ottiene tutti i bags di un establishment specifico
        const bags = await establishmentBagService.getBagsByEstablishment(establishmentId);
        
        // Restituisce i bags trovati come risposta JSON
        res.json(bags);
    } catch (err) {
        console.error(`Error fetching bags for establishment ID ${req.params.establishmentId}:`, err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Controller per recuperare i bags di un establishment in un intervallo di date specifico
export const fetchBagsByEstablishmentAndDateRange = async (req, res) => {
    try {
        const establishmentId = req.params.establishmentId;
        const { startDate, endDate } = req.query;
        
        // Verifica se sono state fornite le date
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start and end dates are required' });
        }
        
        // Ottiene i bags in base all'intervallo di date per un establishment specifico
        const bags = await establishmentBagService.getBagsByEstablishmentAndDateRange(
            establishmentId, 
            startDate, 
            endDate
        );
        
        // Restituisce i bags trovati come risposta JSON
        res.json(bags);
    } catch (err) {
        console.error(`Error fetching bags for establishment ID ${req.params.establishmentId} with date range:`, err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Controller per recuperare i bags disponibili di un establishment specifico
export const fetchAvailableBagsByEstablishment = async (req, res) => {
    try {
        const establishmentId = req.params.establishmentId;
        
        // Ottiene i bags disponibili per un establishment specifico
        const bags = await establishmentBagService.getAvailableBagsByEstablishment(establishmentId);
        
        // Restituisce i bags trovati come risposta JSON
        res.json(bags);
    } catch (err) {
        console.error(`Error fetching available bags for establishment ID ${req.params.establishmentId}:`, err);
        res.status(500).json({ error: 'Database error' });
    }
};

export default { fetchBagsByEstablishment, fetchBagsByEstablishmentAndDateRange, fetchAvailableBagsByEstablishment };