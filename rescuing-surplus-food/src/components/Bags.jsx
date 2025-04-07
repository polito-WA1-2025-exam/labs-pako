import { useState } from 'react';
import RegularBags from './RegularBags';
import SurpriseBags from './SurpriseBags';
import { Button } from 'react-bootstrap';

function Bags() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Scegli il tipo di borsa</h2>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="outline-secondary" className="mx-2" onClick={() => setSelectedType('regular')}>Regular Bags</Button>
        <Button variant="outline-secondary" className="mx-2" onClick={() => setSelectedType('surprise')}>Surprise Bags</Button>
      </div>
      {selectedType === 'regular' && <RegularBags />}
      {selectedType === 'surprise' && <SurpriseBags />}
    </div>
  );
}

export default Bags;
