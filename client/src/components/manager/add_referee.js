import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import '../../styles/add_referee.css';

const AddReferee = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });
  const token = authData.token;

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
    } else {
      navigate('/');
    }
  }, [authData.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.name.trim() === '') {
      setError('Referee name is required.');
      return;
    }

    if (formData.name.trim().length > 40) {
      setError('Referee name must not exceed 40 characters.');
      return;
    }

    if (formData.role.trim() === '') {
      setError('Role is required.');
      return;
    }

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(formData.name.trim())) {
      setError('Team name can only contain alphabetic characters.');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/referee/add`,
        {
          ...formData,
          name: formData.name.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Referee added successfully!');
        setFormData({ name: '', role: '' });
      }
    } catch (error) {
      setError('Error adding referee. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="add-referee">
      <h2 className="text-primary text-2xl">Add New Referee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Referee Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter referee name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Main Referee">Main Referee</option>
            <option value="Linesman">Linesman</option>
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button
          type="submit"
          className="submit-button bg-primary hover:bg-primary/80"
        >
          Add Referee
        </button>
      </form>
    </div>
  );
};

export default AddReferee;
