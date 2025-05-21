export const deleteEstablishment = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Check if the establishment has related bags
        const relatedBags = await establishmentService.getEstablishmentBags(id);
        
        if (relatedBags && relatedBags.length > 0) {
            console.log(`Establishment ${id} has ${relatedBags.length} related bags that will be cascade deleted`);
        }
        
        const result = await establishmentService.deleteEstablishment(id);
        
        if (result) {
            res.json({ message: 'Establishment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Establishment not found' });
        }
    } catch (err) {
        console.error(`Error deleting establishment with ID ${req.params.id}:`, err);
        
        // Provide more specific error messages based on the error
        if (err.message && err.message.includes('FOREIGN KEY constraint failed')) {
            res.status(409).json({ 
                error: 'Cannot delete establishment due to related records',
                details: 'This establishment has related records (bags, reservations, etc.) that prevent deletion. Please delete these related records first.'
            });
        } else {
            res.status(500).json({ 
                error: 'Error deleting establishment',
                details: err.message
            });
        }
    }
};