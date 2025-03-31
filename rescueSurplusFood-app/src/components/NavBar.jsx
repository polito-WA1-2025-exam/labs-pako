import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavBar({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin(); // Aggiorna lo stato di login nell'App
    navigate('/bags'); // Reindirizza alla pagina delle borse
  };

  return (
    <Navbar expand="lg" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <i className="bi bi-basket2-fill me-2"></i>FoodSaver
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#">How It Works</Nav.Link>
            <Nav.Link href="#">About Us</Nav.Link>
          </Nav>
          <div className="d-flex">
            <Button variant="outline-light" onClick={handleLogin}>Login</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
