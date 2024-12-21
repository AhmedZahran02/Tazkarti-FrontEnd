import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/login.css';
import { AuthContext } from '../context/auth_provider';

const Login = ({ baseUrl }) => {
  const [formData, setFormData] = useState({ credential: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { authData, saveAuthData } = useContext(AuthContext);
  const token = authData.token;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.credential.trim() || !formData.password.trim()) {
      setErrors({
        message: 'Both fields are required.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        const cleanedToken = token.startsWith('Bearer ')
          ? token.slice(7)
          : token;

        saveAuthData(cleanedToken, user);

        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          setErrors(data.errors || { message: data.message });
        } else if (status === 401) {
          setErrors({ message: 'Invalid credentials. Please try again.' });
        } else {
          setErrors({
            message:
              data.message ||
              'An unexpected error occurred. Please try again later.',
          });
        }
      } else {
        setErrors({
          message: 'Network error. Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authData.user) {
      navigate('/');
    }
  }, [authData]);

  return (
    <div className="login-page">
      <h2 className="text-3xl text-primary ">Login</h2>
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

        <button
          type="submit"
          className="submit-button bg-primary mt-4 hover:bg-primary/80 "
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>

        {errors.message ? (
          <p className="error-message general-error mt-4">{errors.message}</p>
        ) : (
          <p className="error-message general-error mt-4 opacity-0">text</p>
        )}
      </form>

      <div className="sign-up-link">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
