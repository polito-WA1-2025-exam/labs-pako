import React from 'react';
import { Container } from 'react-bootstrap';

function HeroSection() {
  return (
    <section className="hero-section text-center">
      <Container>
        <div className="hero-text">
          <h1 className="display-4 fw-bold mb-4">Save Food, Save Money, Save Planet</h1>
          <p className="lead mb-4">Join our mission to reduce food waste by rescuing surplus food from local stores and restaurants at discounted prices.</p>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;