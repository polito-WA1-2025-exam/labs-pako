import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/style.css'; // Assicurati di avere questo file nella cartella styles
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import EstablishmentsList from './components/EstablishmentsList';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <Container fluid>        <EstablishmentsList />
        <InfoSection />
      </Container>
      <Footer />
    </>
  );
}

export default App;