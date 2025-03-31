import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/style.css';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import EstablishmentsList from './components/establishment/EstablishmentsList';
import InfoSection from './components/InfoSection';
import BagsPage from './components/bag/BagsPage';
import Footer from './components/Footer';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Funzione per gestire il login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <NavBar onLogin={handleLogin} />

      <Routes>
        <Route path="/" element={!isLoggedIn ? <HomePage /> : <Navigate to="/bags" />} />
        <Route path="/bags" element={isLoggedIn ? <BagsPage /> : <Navigate to="/" />} />
      </Routes>

      <Footer />
    </Router>
  );
}

// Componente Homepage
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
