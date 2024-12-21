import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/signup.css';
import { AuthContext } from '../context/auth_provider';

const SignUp = ({ baseUrl }) => {
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
  const [errors, setErrors] = useState({}); 
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authData.token; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/cities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const result = await response.json();
      setCities(result.data);
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 

    const trimmedFormData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      birthDate: formData.birthDate.trim(),
      gender: formData.gender.trim(),
      city: formData.city.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
    };

    const newErrors = {};

    // Ensure no empty fields
    Object.keys(trimmedFormData).forEach((key) => {
      if (!trimmedFormData[key] && key !== 'address') {
        newErrors[key] = `${key.replace(
          /([A-Z])/g,
          ' $1'
        )}: This field is required.`;
      }
    });

    // Ensure username does not contain spaces
    if (trimmedFormData.username.includes(' ')) {
      newErrors.username = 'Username cannot contain spaces.';
    }

    // Ensure the birth date is in the past
    if (new Date(trimmedFormData.birthDate) >= new Date()) {
      newErrors.birthDate = 'Birth date must be in the past.';
    }

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(trimmedFormData.firstName)) {
      newErrors.firstName =
        'First Name should only contain alphabetic characters.';
    }

    if (!regex.test(trimmedFormData.lastName)) {
      newErrors.lastName =
        'Last Name should only contain alphabetic characters.';
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Proceed with form submission if there are no validation errors
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedFormData),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/login');
      } else {
        const error = await response.json();
        console.error('Error during sign-up:', error.message);

        // Handle specific error messages
        if (error.message.includes('Username already exists')) {
          setErrors({ username: 'This username is already taken.' });
        } else if (error.message.includes('Email already exists')) {
          setErrors({ email: 'This email is already registered.' });
        } else if (
          error.message.includes(
            'Password is weak. It must be 8-20 characters long, contain uppercase, lowercase, and digits, and have no spaces'
          )
        ) {
          setErrors({ password: 'Password is weak.' });
        }
      }
    } catch (error) {
      console.error('Network error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
    if (authData.user !== null) {
      navigate('/');
    }
  }, [authData]);

  return (
    <div className="sign-up-page">
      <h2 className="text-3xl text-primary">Sign Up</h2>
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
          <small>
            Password must be 8-20 characters long, contain uppercase, lowercase,
            and digits, and have no spaces
          </small>
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

        <button
          type="submit"
          className="submit-button bg-primary hover:bg-primary/80"
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
            'Sign up'
          )}
        </button>
      </form>
      <div className="login-link">
        <p>
          Have an account?{' '}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
