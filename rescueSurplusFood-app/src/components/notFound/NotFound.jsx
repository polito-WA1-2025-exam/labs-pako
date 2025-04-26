import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Container className="text-center py-5">
    <h2>Oops! Page Not Found</h2>
    <p>The page you are looking for doesn't exist or has been moved.</p>
    <div className="d-flex justify-content-center gap-3 mt-4">
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </div>
  </Container>
);

export default NotFound;