import React, { useState, useEffect } from 'react';
import '../../styles/create_match_event.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const baseUrl = 'https://not-tazkarti-back-production.up.railway.app'; // Adjust to your backend URL

const CreateMatchEvent = () => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    mainReferee: '',
    firstLinesman: '',
    secondLinesman: '',
  });

  const [teams, setTeams] = useState([]); // Teams from database
  const [venues, setVenues] = useState([]); // Venues from database
  const [referees, setReferees] = useState([]); // All referees from the database
  const [linesmen, setLinesmen] = useState([]); // Linesmen separately
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [loadingReferees, setLoadingReferees] = useState(false);
  const [loadingLinesmen, setLoadingLinesmen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch teams, venues, and referees from the database
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${baseUrl}/team/get-all`);
        setTeams(response.data.teams);
        setLoadingTeams(false);
      } catch (err) {
        setError('Failed to fetch teams.');
        setLoadingTeams(false);
      }
    };

    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${baseUrl}/stadium/get-all`);
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
          `${baseUrl}/referee/get-main-referees`
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
        const response = await axios.get(`${baseUrl}/referee/get-linesmen`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual backend endpoint
      const response = await axios.post(`${baseUrl}/matches/create`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Match Event Created:', response.data);
        alert('Match Event Created Successfully!');
        setFormData({
          homeTeam: '',
          awayTeam: '',
          date: '',
          time: '',
          venue: '',
          description: '',
          mainReferee: '',
          firstLinesman: '',
          secondLinesman: '',
        });
      } else {
        alert('Failed to create match event. Please try again.');
      }
    } catch (error) {
      console.error('Error creating match event:', error);
      alert(
        'Error creating match event. Please check the input and try again.'
      );
    }
  };
  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
      // Redirect if the user is not a manager
    } else {
      navigate('/'); // Redirect to login if not authorized
    }
  }, [authData.user, navigate]);

  // Filter away teams to exclude the home team
  const filteredAwayTeams = teams.filter(
    (team) => team._id !== formData.homeTeam
  );

  const filteredLinesmen = linesmen.filter(
    (linesman) => linesman._id !== formData.firstLinesman
  );

  return (
    <div className="create-match-event">
      <h2>Create Match Event</h2>
      {loadingTeams || loadingVenues || loadingReferees || loadingLinesmen ? (
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

          <button type="submit" className="submit-button">
            Create Match
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateMatchEvent;
