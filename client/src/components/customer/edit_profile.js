import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import '../../styles/edit_profile.css';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ baseUrl }) => {
  const { authData, saveAuthData } = useContext(AuthContext);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({}); // State for field-specific error messages
  console.log(authData.user.birthDate);
  const [formData, setFormData] = useState({
    firstName: authData.user.firstName,
    lastName: authData.user.lastName,
    birthDate: authData.user.birthDate,
    gender: authData.user.gender,
    city: authData.user.city,
    address: authData.user.address,
    role: authData.user ? authData.user.userType : 'customer',
  });
  const token = authData.token; // Get token from context

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${baseUrl}/auth/cities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const result = await response.json();
        setCities(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCities();
    // Initialize form with the current user data
    if (authData.user) {
      setFormData({
        _id: authData.user._id,
        firstName: authData.user.firstName,
        lastName: authData.user.lastName,
        birthDate: authData.user.birthDate,
        gender: authData.user.gender,
        city: authData.user.city,
        address: authData.user.address || '',
        role: authData.user.userType,
      });
    }
  }, [authData]);

  useEffect(() => {
    if (authData.user && authData.user.userType === 'fan') {
      // Redirect to homepage if the user is already logged in
    } else {
      navigate('/');
    }
  }, [authData.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to update user data (replace with actual API endpoint)
      const response = await fetch(`${baseUrl}/users/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const updatedUser = await response.json();

        saveAuthData(authData.token, updatedUser.user);
        alert('Profile updated successfully!');
        setErrorMessage('');
      } else {
        throw new Error('Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('Error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={authData.user.username}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={authData.user.email}
            disabled
          />
        </div>

        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>City:</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a city
            </option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <p className="error-message">{errors.city}</p>}
        </div>

        <div className="form-group">
          <label>Address (Optional):</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <input type="text" name="role" value={formData.role} disabled />
        </div>

        <button type="submit" className="submit-button">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
