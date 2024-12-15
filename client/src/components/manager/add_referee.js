import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after successful submission
import { useEffect } from 'react';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import '../../styles/add_referee.css';

const AddReferee = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    role: '', // Role can be 'Main Referee' or 'Linesman'
  });
  const token = authData.token; // Get token from context

  const [error, setError] = useState(''); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // Redirect if the user is not a manager
    } else {
      navigate('/'); // Redirect to login if not authorized
    }
  }, [authData.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `${baseUrl}/referee/add`, // Adjust this endpoint to your backend
        formData,
        {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );

      if (response.status === 200) {
        alert('Referee added successfully!');
        setFormData({ name: '', role: '' }); // Clear the input fields
      }
    } catch (error) {
      setError('Error adding referee. Please try again.');
      console.error('Error:', error); // Log the error for debugging
    }
  };

  return (
    <div className="add-referee">
      <h2>Add New Referee</h2>
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

        <button type="submit" className="submit-button">
          Add Referee
        </button>
      </form>
    </div>
  );
};

export default AddReferee;
