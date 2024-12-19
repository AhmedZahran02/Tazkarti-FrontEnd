import React from 'react';
import '../../styles/match.css'; // Add styles for the component
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';

import {Timer, Calendar, Stadium} from 'lucide-react'

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
    <div className="match-container flex flex-col gap-5">
      <table className="w-full table-fixed border-collapse">
        <tr className="*:text-xl *:font-bold">
          <td>{teamA.name}</td>
          <td>vs</td>
          <td>{teamB.name}</td>
        </tr>
      </table>
      <hr className="my-2"></hr>

      <table className="w-3/4 m-auto table-fixed border-collapse">
        <tr className="">
          <th className="flex gap-2">
            {' '}
            <Calendar /> Date
          </th>
          <td>{date}</td>
        </tr>

        <div className="my-2"></div>

        <tr className="">
          <th className="flex gap-2">
            {' '}
            <Timer /> Time
          </th>
          <td>{time}</td>
        </tr>

        <div className="my-2"></div>

        <tr className="">
          <th className="flex gap-2">
            <img src="stadium.jpg" alt="stadium-icon" width={20} height={20} />{' '}
            Venue
          </th>
          <td>{venue.name}</td>
        </tr>

        <div className="my-2"></div>

        <tr className="">
          <th className="flex gap-2">
            <img src="referee.png" alt="stadium-icon" width={20} height={20} />
            Main Referee
          </th>
          <td>{mainReferee.name}</td>
        </tr>

        <div className="my-2"></div>

        <tr className="">
          <th className="flex gap-2">
            {' '}
            <img
              src="referee.png"
              alt="stadium-icon"
              width={20}
              height={20}
            />{' '}
            First Linesman
          </th>
          <td>{firstLinesman.name}</td>
        </tr>

        <div className="my-2"></div>

        <tr className="">
          <th className="flex gap-2">
            <img src="referee.png" alt="referee-icon" width={20} height={20} />{' '}
            Second Linesman
          </th>
          <td>{secondLinesman.name}</td>
        </tr>
      </table>

      {/* Book Ticket Button (Visible for fans only) */}
      { !isPastMatch && <div className="w-full flex flex-row h-10">
        {!isPastMatch && (
          <button
            className={`${
              authData.user && authData.user.userType === 'manager'
                ? 'hidden'
                : 'visible'
            } w-[48%] mr-[1%] border-2 border-primary bg-primary text-white`}
            onClick={handleBookTicket}
            disabled={isPastMatch} // Disable if the match is in the past
          >
            Book Ticket
          </button>
        )}

        {/* View Details Button */}
        {!isPastMatch && <button
          onClick={handleViewMatch}
          className="view-details-button flex-1"
          disabled={isPastMatch} // Disable if the match is in the past
        >
          View Details
        </button>}

        {/* Edit Match Button (Visible for managers only) */}
        <button
          className={
            authData.user && authData.user.userType === 'manager'
              ? 'visible flex-1'
              : 'hidden flex-1'
          }
          disabled={isPastMatch} // Disable if the match is in the past
          onClick={handleEditMatch}
        >
          Edit Match
        </button>
      </div>}
    </div>
  );
};

export default Match;
