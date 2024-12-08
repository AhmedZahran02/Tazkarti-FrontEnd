import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/signup.css';
import { AuthContext } from '../context/auth_provider';

const baseUrl = 'https://not-tazkarti-back-production.up.railway.app';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    city: '',
    address: '',
    email: '',
    role: '',
  });
  const [errors, setErrors] = useState({}); // State for field-specific error messages
  const [cities, setCities] = useState([]);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authData.token; // Get token from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the field being edited
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Sign-up successful:', result);
        // Optionally redirect the user to a login or confirmation page
        navigate('/login');
      } else {
        const error = await response.json();
        console.error('Error during sign-up:', error.message);

        // Set error messages for specific fields
        if (error.message.includes('Missing required fields')) {
          setErrors(error.details); // Assuming `details` has field-specific errors
        } else if (error.message.includes('Username already exists')) {
          setErrors({ username: 'This username is already taken.' });
        } else if (error.message.includes('Email already exists')) {
          setErrors({ email: 'This email is already registered.' });
        } else if (error.message.includes('Password is weak')) {
          setErrors({ password: 'Password must meet the strength criteria.' });
        }
      }
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

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
    if (authData.user !== null) {
      navigate('/');
    }
  }, [authData.user, navigate]);

  return (
    <div className="sign-up-page">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username (Unique):</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
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
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
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
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
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
          {errors.birthDate && (
            <p className="error-message">{errors.birthDate}</p>
          )}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
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
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="manager">Manager</option>
            <option value="fan">Fan</option>
          </select>
          {errors.role && <p className="error-message">{errors.role}</p>}
        </div>

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
      <div className="login-link">
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
