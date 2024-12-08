import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation after submit
import '../../styles/add_team.css';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import { useEffect } from 'react';
const baseUrl = 'https://not-tazkarti-back-production.up.railway.app'; // Adjust the base URL to your backend

const AddTeam = () => {
  const { authData } = useContext(AuthContext);
  const [teamName, setTeamName] = useState(''); // State for the team name input
  const [error, setError] = useState(''); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(''); // State to store success messages
  const navigate = useNavigate(); // To navigate to a different page after successful submission
  const token = authData.token; // Get token from context

  const handleChange = (e) => {
    setTeamName(e.target.value); // Update teamName state with the input value
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
    setError(''); // Clear any previous error
    setSuccessMessage(''); // Clear previous success message

    try {
      const response = await axios.post(
        `${baseUrl}/team/add`, // Adjust the endpoint to your backend
        { teamName }, // Send the team name in the request body
        {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );

      if (response.status === 200) {
        alert('Team added successfully!');
        setTeamName(''); // Clear the team name input field
      }
    } catch (error) {
      setError('Error adding team. Please try again.');
      console.error('Error:', error); // Log the error for debugging
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
