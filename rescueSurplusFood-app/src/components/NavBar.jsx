import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function NavBar({ cartItemCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, logout } = useAuth();  
  
  const handleLogin = () => {
    login();  // Usa la funzione login dal context
    navigate('/bags');
  };
  
  const handleLogout = () => {
    logout();  // Usa la funzione logout dal context
    navigate('/');
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
            
            {/* Mostra il link al carrello solo quando l'utente è loggato */}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/cart">
                <i className="bi bi-cart"></i> Cart
                {cartItemCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-1">{cartItemCount}</span>
                )}
              </Nav.Link>
            )}
          </Nav>
          <div className="d-flex">
            {!isLoggedIn ? (
              <Button variant="outline-light" onClick={handleLogin}>
                Login
              </Button>
            ) : (
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;