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
  const token = authData.token; // Get token from context

  // Fetch matches from an API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${baseUrl}/matches/`, {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }); // Adjust URL based on your backend

        if (response.status !== 200) {
          throw new Error('Failed to fetch matches.');
        }

        // Filter the response to only include the 'name' field for the nested objects
        console.log(response.data.matches);
        // const filteredMatches = response.data.matches.map((match) => {
        //   return {
        //     id: match._id,
        //     date: match.date,
        //     time: match.time,
        //     homeTeam: match.homeTeam.name, // Only get the 'name' field
        //     awayTeam: match.awayTeam.name, // Only get the 'name' field
        //     mainReferee: match.mainReferee.name, // Only get the 'name' field
        //     firstLinesman: match.firstLinesman.name, // Only get the 'name' field
        //     secondLinesman: match.secondLinesman.name, // Only get the 'name' field
        //     venue: match.matchVenue.name, // Only get the 'name' field
        //   };
        // });
        let matches = response.data.matches
        matches.sort((a, b) => {
          let dateA = new Date(`${a.date}T${a.time}`);
          let dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA;
        });
        setMatches(matches); // Update the state with filtered matches
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []); // Empty dependency array ensures this runs only once

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
