import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/style.css';

// Componenti esistenti
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import EstablishmentsList from './components/establishment/EstablishmentsList';
import InfoSection from './components/InfoSection';
import BagsPage from './components/bag/BagsPage';
import Footer from './components/Footer';

// Nuovo componente per il carrello
import ShoppingCart from './components/cart/ShoppingCart';

import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Funzione per gestire il login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <NavBar onLogin={handleLogin} cartItemCount={0} /> {/* Gestione del conteggio è fatta in ShoppingCart */}
      <Routes>
        <Route path="/" element={!isLoggedIn ? <HomePage /> : <Navigate to="/bags" />} />
        <Route 
          path="/bags" 
          element={isLoggedIn ? <BagsPage /> : <Navigate to="/" />} 
        />
        {/* Nuova route per il carrello */}
        <Route 
            path="/cart" 
            element={isLoggedIn ? <ShoppingCart /> : <Navigate to="/" />} 
          />
      </Routes>
      <Footer />
    </Router>
  );
}

// Componente Homepage (rimane invariato)
const HomePage = () => (
  <>
    <HeroSection 
      title="Save Food, Save Money, Save Planet" 
      subtitle="Join our mission to reduce food waste by rescuing surplus food from local stores and restaurants at discounted prices." 
    />
    <Container fluid className="pt-4 bg-light justify-content-center">
      <Row className="justify-content-center">
        <Col md={10} >
          <EstablishmentsList />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={10}>
          <InfoSection />
        </Col>
      </Row>         
    </Container>
  </>
);

export default App;
