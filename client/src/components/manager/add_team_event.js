import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/add_team.css';
import { AuthContext } from '../context/auth_provider';

const AddTeam = ({ baseUrl }) => {
  const { authData } = useContext(AuthContext);
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const token = authData.token;

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // Allow access for managers
    } else {
      navigate('/'); // Redirect to home if not authorized
    }
  }, [authData.user, navigate]);

  const handleChange = (e) => {
    setTeamName(e.target.value); // Update teamName state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    const trimmedName = teamName.trim();
    if (trimmedName === '') {
      setError('Team name is required.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Team name must not exceed 50 characters.');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/team/add`,
        { teamName: trimmedName }, // Trim input before sending
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Team added successfully!');
        setTeamName(''); // Clear input field
      }
    } catch (error) {
      setError('Error adding team. Please try again.');
      console.error('Error:', error); // Log error for debugging
    }
  };

  return (
    <div className="add-team">
      <h2>Add New Team</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Team Name:</label>
          <input
            type="text"
            id="teamName"
            name="teamName"
            value={teamName}
            onChange={handleChange}
            required
            placeholder="Enter team name"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="submit-button">
          Add Team
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
