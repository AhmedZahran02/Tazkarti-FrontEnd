import React, { useState, useEffect, useContext } from 'react';
import '../../styles/create_stadium_event.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';

const CreateStadiumEvent = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    stadiumName: '',
    length: '', // Number of rows
    width: '', // Seats per row
    numberOfSeats: '', // Calculated total seats
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = authData.token;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData and reset error
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user updates the input
  };

  const calculateTotalSeats = () => {
    const { length, width } = formData;
    if (length > 0 && width > 0) {
      const numberOfSeats = parseInt(length) * parseInt(width);
      setFormData((prev) => ({ ...prev, numberOfSeats }));
    } else {
      setError('Rows and seats per row must be greater than zero.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Ensure inputs are valid
    const { stadiumName, length, width } = formData;
    if (!stadiumName.trim()) {
      setError('Stadium name is required.');
      return;
    }

    const regex = /^[a-zA-Z0-9\s]+$/;
    if (!regex.test(stadiumName.trim())) {
      setError('Stadium name can only contain alphabetic or numeric characters.');
      return;
    }

    if ( (length <= 0 || width <= 0) || (length > 50 || width > 50) ) {
      setError('Rows and seats per row must be greater than zero. and less than 50');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/stadium/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
        setError('Failed to add stadium. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // User is authorized
    } else {
      navigate('/');
    }
  }, [authData.user, navigate]);

  return (
    <div className="create-stadium">
      <h2 className='text-primary text-2xl'>Create New Stadium</h2>
      {error && <p className="error-message">{error}</p>}
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
            placeholder="Enter stadium name"
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
            min="1"
            placeholder="Enter number of rows"
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
            min="1"
            placeholder="Enter seats per row"
          />
        </div>

        <div className="form-group">
          <label>Total Seats:</label>
          <input
            type="text"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            readOnly
            placeholder="Calculated automatically"
          />
        </div>

        <button type="submit" className="submit-button bg-primary hover:bg-primary/80">
          Add Stadium
        </button>
      </form>
    </div>
  );
};

export default CreateStadiumEvent;
