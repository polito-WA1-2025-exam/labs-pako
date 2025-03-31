import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">FoodSaver</h5>
            <p>Reducing food waste one meal at a time. Join our mission to create a more sustainable future through conscious food consumption.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Contact Us</h5>
            <p><i className="bi bi-envelope-fill me-2"></i> info@foodsaver.com</p>
            <p><i className="bi bi-telephone-fill me-2"></i> +39 011 123 4567</p>
            <p><i className="bi bi-geo-alt-fill me-2"></i> Corso Duca degli Abruzzi, 24, Turin</p>
          </Col>
          <Col md={4}>
            <h5 className="mb-3">Follow Us</h5>
            <div className="mb-3">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-linkedin"></i></a>
            </div>
          </Col>
        </Row>
        <hr className="mt-4 mb-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center">
          <p className="mb-0">&copy; 2025 FoodSaver. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;