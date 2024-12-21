import React, { useState, useEffect } from 'react';
import '../../styles/edit_match_event.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import axios from 'axios';

const EditMatchEvent = ({ baseUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const { authData, clearAuthData, saveAuthData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    _id: location.state.id,
    homeTeam: location.state.teamA._id,
    awayTeam: location.state.teamB._id,
    date: location.state.date,
    time: location.state.time,
    venue: location.state.venue._id,
    mainReferee: location.state.mainReferee._id, // Add mainReferee
    firstLinesman: location.state.firstLinesman._id, // Add firstLinesman
    secondLinesman: location.state.secondLinesman._id, // Add secondLinesman
  });

  const [teams, setTeams] = useState([]); // Teams from database
  const [venues, setVenues] = useState([]); // Venues from database
  const [referees, setReferees] = useState([]); // Referees from the database
  const [linesmen, setLinesmen] = useState([]); // Linesmen separately
  const [loadingLinesmen, setLoadingLinesmen] = useState(false);

  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [loadingReferees, setLoadingReferees] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    date: null,
  });

  const token = authData.token; // Get token from context

  // Fetch match details, referees, teams, and venues from the database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${baseUrl}/team/get-all`, {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        setTeams(response.data.teams);
        setLoadingTeams(false);
      } catch (err) {
        setError('Failed to fetch teams.');
        setLoadingTeams(false);
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${baseUrl}/stadium/get-all`, {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        setVenues(response.data.stadiums);
        setLoadingVenues(false);
      } catch (err) {
        setError('Failed to fetch venues.');
        setLoadingVenues(false);
      }
    };

    const fetchReferees = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/referee/get-main-referees`,
          {
            headers: {
              'Content-Type': 'application/json', // Set content type for the request
              Authorization: `Bearer ${token}`, // Include the token in the request header
            },
          }
        );
        setReferees(response.data.referees); // Main referees
        setLoadingReferees(false);
      } catch (err) {
        setError('Failed to fetch referees.');
        setLoadingReferees(false);
      }
    };

    const fetchLinesmen = async () => {
      try {
        const response = await axios.get(`${baseUrl}/referee/get-linesmen`, {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        });
        setLinesmen(response.data.referees); // Linesmen
        setLoadingLinesmen(false);
      } catch (err) {
        setError('Failed to fetch linesmen.');
        setLoadingLinesmen(false);
      }
    };

    fetchTeams();
    fetchVenues();
    fetchReferees();
    fetchLinesmen();
  }, []);

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // Redirect to homepage if the user is already logged in
    } else {
      navigate('/'); // Redirect to login if not authorized
    }
  }, [authData.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'birthDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate < today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          birthDate: 'Birth date cannot be in the past.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          birthDate: '', // Clear the error if the date is valid
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    const today = new Date();
    if (selectedDate < today) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: 'Birth date cannot be in the past.',
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: '', // Clear the error if the date is valid
      }));
    }
    try {
      console.log(formData);
      const response = await fetch(`${baseUrl}/matches/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
        body: JSON.stringify(formData),
      });

      if (response.status !== 200) {
        throw new Error('Failed to update match details.');
      }
      alert('Match Event Updated Successfully!');
    } catch (err) {
      console.error('Error updating match event:', err);
      alert('An error occurred. Please try again.');
    }
  };

  const filteredAwayTeams = teams.filter(
    (team) => team._id !== formData.homeTeam
  );

  const filteredLinesmen = linesmen.filter(
    (linesman) => linesman._id !== formData.firstLinesman
  );

  return (
    <div className="edit-match-event">
      <h2 className='text-primary text-2xl'>Edit Match Event</h2>
      {loadingTeams || loadingVenues || loadingReferees ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Home Team:</label>
            <select
              name="homeTeam"
              value={formData.homeTeam}
              onChange={handleChange}
              required
            >
              <option value="">Select Home Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Away Team:</label>
            <select
              name="awayTeam"
              value={formData.awayTeam}
              onChange={handleChange}
              required
            >
              <option value="">Select Away Team</option>
              {filteredAwayTeams.map((team) => (
                <option key={team.id} value={team._id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <p className="error-message">{errors.date}</p>}
          </div>

          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Venue:</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            >
              <option value="">Select Venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          {/* Referee Fields */}
          <div className="form-group">
            <label>Main Referee:</label>
            <select
              name="mainReferee"
              value={formData.mainReferee}
              onChange={handleChange}
              required
            >
              <option value="">Select Main Referee</option>
              {referees.map((referee) => (
                <option key={referee.id} value={referee._id}>
                  {referee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>First Linesman:</label>
            <select
              name="firstLinesman"
              value={formData.firstLinesman}
              onChange={handleChange}
              required
            >
              <option value="">Select First Linesman</option>
              {linesmen.map((referee) => (
                <option key={referee.id} value={referee._id}>
                  {referee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Second Linesman:</label>
            <select
              name="secondLinesman"
              value={formData.secondLinesman}
              onChange={handleChange}
              required
            >
              <option value="">Select Second Linesman</option>
              {filteredLinesmen.map((referee) => (
                <option key={referee.id} value={referee._id}>
                  {referee.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button bg-primary hover:bg-primary/80">
            Update Match
          </button>
        </form>
      )}
    </div>
  );
};

export default EditMatchEvent;
