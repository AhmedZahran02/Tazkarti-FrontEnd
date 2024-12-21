import React, { useState, useEffect } from 'react';
import Match from './match';
import axios from 'axios';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';

const Matches = ({ baseUrl }) => {
  const { authData } = useContext(AuthContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = authData.token;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${baseUrl}/matches/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch matches.');
        }

        let matches = response.data.matches;
        matches.sort((a, b) => {
          let dateA = new Date(`${a.date}T${a.time}`);
          let dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA;
        });
        setMatches(matches);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="matches-list">
      {matches.length > 0 ? (
        matches.map((match, index) => (
          <Match
            id={match._id}
            key={index}
            teamA={match.homeTeam}
            teamB={match.awayTeam}
            date={match.date}
            time={match.time}
            venue={match.matchVenue}
            mainReferee={match.mainReferee}
            firstLinesman={match.firstLinesman}
            secondLinesman={match.secondLinesman}
          />
        ))
      ) : (
        <p>No matches available.</p>
      )}
    </div>
  );
};

export default Matches;
