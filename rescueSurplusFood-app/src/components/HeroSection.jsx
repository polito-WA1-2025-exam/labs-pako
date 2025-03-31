import React from 'react';
import { Container } from 'react-bootstrap';

function HeroSection({ title, subtitle }) {
  return (
    <section className="hero-section text-center mb-0">
      <Container>
        <div className="hero-text">
          <h1 className="display-4 fw-bold mb-4">{title}</h1>
          <p className="lead mb-4">{subtitle}</p>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
