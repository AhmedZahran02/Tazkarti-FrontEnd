import React from 'react';
import '../../styles/match.css'; // Add styles for the component
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';

import { Timer, Calendar, Stadium } from 'lucide-react';

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

  const matchDate = new Date(date);
  const currentDate = new Date();
  const isPastMatch = matchDate < currentDate;

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
          <td className="text-primary">{teamA.name}</td>
          <td className="text-primary">vs</td>
          <td className="text-primary">{teamB.name}</td>
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
      {!isPastMatch && (
        <div className="w-full flex flex-row gap-5 h-10">
          {!isPastMatch && (
            <button
              className={`${
                authData.user && authData.user.userType === 'manager'
                  ? 'hidden'
                  : 'visible'
              } lg:w-[48%] mr-[1%] border-2 border-primary bg-primary text-white`}
              onClick={handleBookTicket}
              disabled={isPastMatch}
            >
              Book Ticket
            </button>
          )}

          {/* View Details Button */}
          {!isPastMatch && (
            <button
              onClick={handleViewMatch}
              className="view-details-button flex-1"
              disabled={isPastMatch}
            >
              View Details
            </button>
          )}

          {/* Edit Match Button (Visible for managers only) */}
          <button
            className={
              authData.user && authData.user.userType === 'manager'
                ? 'visible flex-1 bg-primary border-black text-white'
                : 'hidden flex-1 bg-primary border-black text-white'
            }
            disabled={isPastMatch}
            onClick={handleEditMatch}
          >
            Edit Match
          </button>
        </div>
      )}
    </div>
  );
};

export default Match;
