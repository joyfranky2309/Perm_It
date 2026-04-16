import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      const fetchCount = async () => {
        try {
          const res = await api.get('/users?limit=1');
          setUserCount(res.total !== undefined ? res.total : '?');
        } catch (e) {
          setUserCount('Error');
        }
      };
      fetchCount();
    }
  }, [user]);

  const renderAdminDashboard = () => (
    <Row>
      <Col md={4}>
        <Card className="custom-card mb-4 text-center">
          <Card.Body>
            <Card.Title>Total Users</Card.Title>
            <h2>{userCount === null ? <Spinner animation="border" size="sm" /> : userCount}</h2>
            <Card.Text>System wide users</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        <Card className="custom-card mb-4">
          <Card.Body>
            <Card.Title>System Overview</Card.Title>
            <p>Welcome to the Admin Dashboard. You have full system access to manage users, configuration, and monitor system health.</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderManagerDashboard = () => (
    <Row>
      <Col md={6}>
        <Card className="custom-card mb-4">
          <Card.Body>
            <Card.Title>Team Overview</Card.Title>
            <p>Welcome to the Manager Dashboard. You can view all users and manage standard users in your organization.</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderUserDashboard = () => (
    <Row>
      <Col md={6}>
        <Card className="custom-card mb-4">
          <Card.Body>
            <Card.Title>Personal Summary</Card.Title>
            <p>Welcome back, {user.name}.</p>
            <ul>
              <li><strong>Role:</strong> {user.role}</li>
              <li><strong>Status:</strong> {user.status}</li>
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <Container>
      <h2 className="mb-4">Dashboard</h2>
      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'manager' && renderManagerDashboard()}
      {user.role === 'user' && renderUserDashboard()}
    </Container>
  );
};

export default Dashboard;
