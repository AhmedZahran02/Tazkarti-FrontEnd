import React from 'react';
import '../../styles/match.css'; // Add styles for the component
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';

const Match = ({
  id,
  teamA,
  teamB,
  date,
  time,
  venue,
  mainReferee,
  firstLinesman,
  secondLinesman,
}) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  // Parse the match date for comparison
  const matchDate = new Date(date);
  const currentDate = new Date();
  const isPastMatch = matchDate < currentDate;

  // Handle booking a ticket (only for fans)
  const handleBookTicket = () => {
    if (authData.user && authData.user.userType === 'fan') {
      navigate(`/match-details/${id}`, {
        state: {
          id,
          teamA,
          teamB,
          date,
          time,
          venue,
          mainReferee,
          firstLinesman,
          secondLinesman,
        },
      });
    } else {
      navigate(`/login`);
    }
  };

  // Handle editing the match (only for managers)
  const handleEditMatch = () => {
    if (authData.user && authData.user.userType === 'manager') {
      navigate(`/edit-match/${id}`, {
        state: {
          id,
          teamA,
          teamB,
          date,
          time,
          venue,
          mainReferee,
          firstLinesman,
          secondLinesman,
        },
      });
    } else {
      navigate(`/login`);
    }
  };

  // Handle viewing the match details
  const handleViewMatch = () => {
    navigate(`/match-details/${id}`, {
      state: {
        id,
        teamA,
        teamB,
        date,
        time,
        venue,
        mainReferee,
        firstLinesman,
        secondLinesman,
      },
    });
  };

  return (
    <div className="match-container">
      <div className="match-teams">
        <div className="team">
          <h2>{teamA.name}</h2>
        </div>
        <div className="versus">VS</div>
        <div className="team">
          <h2>{teamB.name}</h2>
        </div>
      </div>

      <div className="match-info">
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Venue: {venue.name}</p>
        <p>Main Referee: {mainReferee.name}</p>
        <p>First Linesman: {firstLinesman.name}</p>
        <p>Second Linesman: {secondLinesman.name}</p>
      </div>

      {/* Book Ticket Button (Visible for fans only) */}
      <button
        className={
          authData.user && authData.user.userType === 'manager'
            ? 'hidden'
            : 'visible'
        }
        onClick={handleBookTicket}
        disabled={isPastMatch} // Disable if the match is in the past
      >
        Book Ticket
      </button>

      {/* View Details Button */}
      <button
        onClick={handleViewMatch}
        className="view-details-button"
        disabled={isPastMatch} // Disable if the match is in the past
      >
        View Details
      </button>

      {/* Edit Match Button (Visible for managers only) */}
      <button
        className={
          authData.user && authData.user.userType === 'manager'
            ? 'visible'
            : 'hidden'
        }
        disabled={isPastMatch} // Disable if the match is in the past
        onClick={handleEditMatch}
      >
        Edit Match
      </button>
    </div>
  );
};

export default Match;
