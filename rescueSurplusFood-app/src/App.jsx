import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/style.css';
// Componenti esistenti
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import EstablishmentsList from './components/establishment/EstablishmentsList';
import EstablishmentDetail from './components/establishment/EstablishmentDetail'; // Importa il nuovo componente
import InfoSection from './components/InfoSection';
import BagsPage from './components/bag/BagsPage';
import Footer from './components/Footer';
import { CartProvider } from './components/context/CartContext';  // Importa il provider
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
    <CartProvider>
      <NavBar onLogin={handleLogin} cartItemCount={0} />
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
        {/* Nuova route per i dettagli dell'establishment */}
        <Route 
          path="/establishments/:id" 
          element={<EstablishmentDetail />} 
        />
        {/* Aggiungi una route per gestire pagine non trovate */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </CartProvider>
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

// Componente per pagine non trovate
const NotFound = () => (
  <Container className="text-center py-5">
    <h2>Oops! Page Not Found</h2>
    <p>The page you are looking for doesn't exist or has been moved.</p>
  </Container>
);

export default App;