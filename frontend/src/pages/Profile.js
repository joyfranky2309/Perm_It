import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get('/users/me');
        const ud = data.user || data;
        setProfileData(ud);
        setFormData({ name: ud.name, password: '' });
      } catch (err) {
        setError('Failed to load profile details.');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { name: formData.name };
      if (formData.password) {
        payload.password = formData.password;
      }
      const data = await api.put('/users/me', payload);
      setUser(data.user || data); // Update context
      setMessage('Profile updated successfully.');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (err) {
      setError(err.message || 'Error updating profile');
    }
  };

  if (!profileData) return <Container>Loading...</Container>;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="custom-card mb-4">
            <Card.Header as="h5">My Profile</Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={profileData.email} disabled />
                  <Form.Text className="text-muted">You cannot change your email address.</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control type="text" value={profileData.role} disabled />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Leave blank to keep current password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">Update Profile</Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="custom-card">
            <Card.Header>Audit Information</Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li><strong>Created At:</strong> {new Date(profileData.createdAt).toLocaleString()}</li>
                <li><strong>Last Updated:</strong> {new Date(profileData.updatedAt).toLocaleString()}</li>
                {profileData.createdBy && <li><strong>Created By (ID):</strong> {profileData.createdBy}</li>}
                {profileData.updatedBy && <li><strong>Updated By (ID):</strong> {profileData.updatedBy}</li>}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
