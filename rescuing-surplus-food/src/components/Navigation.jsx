// components/Navigation.jsx
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function Navigation({ onNavigate }) {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Surplus Food</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={() => onNavigate('home')}>Home</Nav.Link>
          <Nav.Link onClick={() => onNavigate('bags')}>Bags</Nav.Link>
          <Nav.Link onClick={() => onNavigate('restaurants')}>Restaurants</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

