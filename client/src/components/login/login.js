import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/login.css';
import { AuthContext } from '../context/auth_provider';

const baseUrl = 'https://not-tazkarti-back-production.up.railway.app';

const Login = () => {
  const [formData, setFormData] = useState({ credential: '', password: '' }); // Credential can be email or username
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { authData, saveAuthData } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear specific field error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear all previous errors

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Include this if your backend uses cookies for authentication
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        // Remove 'Bearer ' prefix from the token if it exists
        const cleanedToken = token.startsWith('Bearer ')
          ? token.slice(7)
          : token;

        // Save auth data to context without 'Bearer ' prefix
        console.log(user);
        saveAuthData(cleanedToken, user);

        // Redirect to the homepage or dashboard
        navigate('/');
      }
    } catch (err) {
      // Handle specific error cases
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          // Field-specific errors
          setErrors(data.errors || { message: data.message });
        } else if (status === 401) {
          // Invalid credentials
          setErrors({ message: 'Invalid credentials. Please try again.' });
        } else {
          // General errors
          setErrors({
            message:
              data.message ||
              'An unexpected error occurred. Please try again later.',
          });
        }
      } else {
        // Network or unexpected errors
        setErrors({
          message: 'Network error. Please check your connection and try again.',
        });
      }
    }
  };

  useEffect(() => {
    if (authData.user) {
      navigate('/'); // Redirect if already logged in
    }
  }, [authData.user, navigate]);

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Username:</label>
          <input
            type="text"
            name="credential"
            value={formData.credential}
            onChange={handleChange}
            placeholder="Enter your email or username"
            required
          />
          {errors.credential && (
            <p className="error-message">{errors.credential}</p>
          )}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>

        {errors.message && (
          <p className="error-message general-error">{errors.message}</p>
        )}
      </form>

      <div className="sign-up-link">
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
