import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './styles/style.css';

// Componenti esistenti
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import EstablishmentsList from './components/establishment/EstablishmentsList';
import EstablishmentDetail from './components/establishment/EstablishmentDetail';
import InfoSection from './components/InfoSection';
import BagsPage from './components/bag/BagsPage';
import Footer from './components/Footer';
import { CartProvider } from './components/context/CartContext';
import { AuthProvider, useAuth } from './components/context/AuthContext';

// Nuovo componente per il carrello
import ShoppingCart from './components/cart/ShoppingCart';
import { Container, Row, Col } from 'react-bootstrap';
import NotFound from './components/notFound/NotFound';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

// Componente che utilizza il context
function AppContent() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/bags" element={<ProtectedRoute element={<BagsPage />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<ShoppingCart />} />} />
        <Route path="/establishments/:id" element={<EstablishmentDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

// Componente per le route protette
function ProtectedRoute({ element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/" />;
}

// Componente per la route home
function HomeRoute() {
  return (
    <>
      <HeroSection
        title="Save Food, Save Money, Save Planet"
        subtitle="Join our mission to reduce food waste by rescuing surplus food from local stores and restaurants at discounted prices."
      />
      <Container fluid className="pt-4 bg-light justify-content-center">
        <Row className="justify-content-center">
          <Col md={10}>
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
}

export default App;