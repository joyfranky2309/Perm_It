import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Navbar className="custom-nav mb-4" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Perm_IT Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {(user.role === 'admin' || user.role === 'manager') && (
              <Nav.Link as={Link} to="/users">User Management</Nav.Link>
            )}
            
            <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text className="me-3">
              Signed in as: {user.name} ({user.role})
            </Navbar.Text>
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
