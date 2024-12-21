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
    } else {
      navigate('/'); 
    }
  }, [authData.user, navigate]);

  const handleChange = (e) => {
    setTeamName(e.target.value); 
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

    const regex = /^[a-zA-Z\s]+$/;
    if (!regex.test(trimmedName)) {
      setError('Team name can only contain alphabetic characters.');
      return;
    }

    if (trimmedName.length > 50) {
      setError('Team name must not exceed 50 characters.');
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/team/add`,
        { teamName: trimmedName }, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Team added successfully!');
        setTeamName(''); 
      }
    } catch (error) {
      setError('Error adding team. Please try again.');
      console.error('Error:', error); 
    }
  };

  return (
    <div className="add-team">
      <h2 className="text-primary text-2xl">Add New Team</h2>
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
        <button type="submit" className="submit-button bg-primary hover:bg-primary/80">
          Add Team
        </button>
      </form>
    </div>
  );
};

export default AddTeam;
