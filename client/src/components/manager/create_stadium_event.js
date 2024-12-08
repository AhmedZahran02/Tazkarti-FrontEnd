import React, { useState } from 'react';
import '../../styles/create_stadium_event.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import { useEffect } from 'react';

const baseUrl = 'https://not-tazkarti-back-production.up.railway.app'; // Adjust the base URL to your backend

const CreateStadiumEvent = () => {
  const navigate = useNavigate();
  const { authData, clearAuthData, saveAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    stadiumName: '',
    length: '', // For number of rows (length of VIP lounge)
    width: '', // For number of seats per row (width of VIP lounge)
    numberOfSeats: '', // Total number of seats (calculated)
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Calculate total seats based on rows and seats per row
  const calculateTotalSeats = () => {
    const { length, width } = formData;
    if (length && width) {
      const numberOfSeats = parseInt(length) * parseInt(width);
      setFormData((prevData) => ({
        ...prevData,
        numberOfSeats: numberOfSeats,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to save stadium data (replace with actual API endpoint)
      const response = await fetch(`${baseUrl}/stadium/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Stadium added successfully!');
        setFormData({
          stadiumName: '',
          length: '',
          width: '',
          numberOfSeats: '',
        });
      } else {
        setSuccessMessage('Failed to add stadium.');
      }
    } catch (error) {
      setSuccessMessage('Error occurred. Please try again.');
    }
  };
  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // Redirect to homepage if the user is already logged in
    } else {
      navigate('/');
    }
  }, [authData.user, navigate]);
  return (
    <div className="create-stadium">
      <h2>Create New Stadium</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Stadium Name:</label>
          <input
            type="text"
            name="stadiumName"
            value={formData.stadiumName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Rows (Length of VIP Lounge):</label>
          <input
            type="number"
            name="length"
            value={formData.length}
            onChange={handleChange}
            onBlur={calculateTotalSeats}
            required
          />
        </div>

        <div className="form-group">
          <label>Seats per Row (Width of VIP Lounge):</label>
          <input
            type="number"
            name="width"
            value={formData.width}
            onChange={handleChange}
            onBlur={calculateTotalSeats}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Seats:</label>
          <input
            type="text"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            readOnly
          />
        </div>

        <button type="submit" className="submit-button">
          Add Stadium
        </button>
      </form>
    </div>
  );
};

export default CreateStadiumEvent;
