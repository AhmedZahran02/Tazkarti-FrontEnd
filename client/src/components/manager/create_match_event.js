import React, { useState, useEffect } from 'react';
import '../../styles/create_match_event.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import axios from 'axios';

const CreateMatchEvent = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [errors, setErrors] = useState({
    date: '',
  });
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

  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [referees, setReferees] = useState([]);
  const [linesmen, setLinesmen] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [loadingReferees, setLoadingReferees] = useState(false);
  const [loadingLinesmen, setLoadingLinesmen] = useState(false);
  const [error, setError] = useState(null);
  const token = authData.token;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'date') {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate < today) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: 'Match date cannot be in the past.',
        }));
        return;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: '',
        }));
      }

      const response = await axios.post(`${baseUrl}/matches/create`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
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
        alert(response.message);
      }
    } catch (error) {
      console.error('Error creating match event:', error);
      alert(
        'Something Went Wrong, Some Entries Are Assigned To Overlapped Matches'
      );
    }
  };

  useEffect(() => {
    if (authData.user && authData.user.userType === 'manager') {
    } else {
      navigate('/');
    }
  }, [authData.user, navigate]);

  const filteredAwayTeams = teams.filter(
    (team) => team._id !== formData.homeTeam
  );

  const filteredLinesmen = linesmen.filter(
    (linesman) => linesman._id !== formData.firstLinesman
  );

  return (
    <div className="create-match-event">
      <h2 className="text-primary text-2xl">Create Match Event</h2>
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

          <button
            type="submit"
            className="submit-button bg-primary hover:bg-primary/80"
          >
            Create Match
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateMatchEvent;
