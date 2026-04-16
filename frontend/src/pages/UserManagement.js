import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Form, Row, Col, Modal, Badge, Spinner } from 'react-bootstrap';
import { api } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Assuming backend supports these or we do client side. We'll fetch all and do client side for simplicity.
      const responseData = await api.get('/users');
      setUsers(responseData.data || responseData.users || responseData);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShowModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // Don't send empty password
      
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert('Error saving user: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        {user.role === 'admin' && (
          <Button variant="primary" onClick={() => handleShowModal()}>Add New User</Button>
        )}
      </div>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </Col>
        <Col md={4}>
          <Form.Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Col>
      </Row>

      <Table responsive striped hover className="custom-card">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2 text-muted">Loading users...</div>
              </td>
            </tr>
          ) : filteredUsers.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><Badge bg={u.role === 'admin' ? 'danger' : u.role === 'manager' ? 'success' : 'info'}>{u.role}</Badge></td>
              <td><Badge bg={u.status === 'active' ? 'primary' : 'secondary'}>{u.status}</Badge></td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleShowModal(u)}
                  disabled={user.role === 'manager' && u.role === 'admin'}
                >
                  Edit
                </Button>
                {user.role === 'admin' && (
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u._id)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {!loading && filteredUsers.length === 0 && (
            <tr><td colSpan="5" className="text-center">No users found.</td></tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Create User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={!!editingUser} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password {editingUser && '(Leave blank to keep current)'}</Form.Label>
              <Form.Control type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </Form.Group>
            {user.role === 'admin' && (
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default UserManagement;
