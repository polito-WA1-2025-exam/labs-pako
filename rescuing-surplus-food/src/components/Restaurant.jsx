import { Card, Row, Col } from 'react-bootstrap';

const restaurants = [
  {
    name: 'Frutta Mia',
    address: 'Via Roma 12, Torino',
    category: 'Fruttivendolo',
    offer: 'Regular Bags'
  },
  {
    name: 'Pane e Fantasia',
    address: 'Corso Italia 45, Milano',
    category: 'Panetteria',
    offer: 'Regular Bags'
  },
  {
    name: 'Sushi Express',
    address: 'Viale Venezia 99, Bologna',
    category: 'Ristorante Giapponese',
    offer: 'Surprise Bags'
  }
];

function Restaurants() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Ristoranti partecipanti</h2>
      <Row>
        {restaurants.map((r, idx) => (
          <Col key={idx} md={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{r.name}</Card.Title>
                <Card.Text>
                  Indirizzo: {r.address}<br />
                  Categoria: {r.category}<br />
                  <strong>Offre:</strong> {r.offer}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Restaurants;
