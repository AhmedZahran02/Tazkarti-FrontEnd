import React, { useState, useEffect } from 'react';
import ReservationCard from './reservation_card';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import '../../styles/reservation_card_list.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import socket.io-client

const ReservationList = ({ baseUrl }) => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const token = authData.token; // Get token from context

  // Fetch reservations for the logged-in user
  useEffect(() => {
    const socket = io(baseUrl);
    setSocket(socket);

    const fetchReservations = async () => {
      try {
        if (!authData.user || authData.user.userType !== 'fan') {
          navigate('/'); // Redirect if the user is not a fan
          return;
        }

        const response = await axios.get(
          `${baseUrl}/ticket/${authData.user._id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authData.token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data.tickets);
          setReservations(response.data.tickets);
        } else {
          throw new Error('Failed to fetch reservations.');
        }
      } catch (err) {
        console.error('Error fetching reservations:', err.message);
        setError('Unable to load reservations.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();

    return () => {
      socket.disconnect();
    };
  }, [authData.user, authData.token, navigate]);

  const handleCancel = async (tickeId, reservationId) => {
    try {
      const response = await axios.delete(`${baseUrl}/ticket/${tickeId}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (response.status === 200) {
        if (socket) {
          socket.emit('reserve-seat', 'message'); // Emit the reservation event to the server
        }
        setReservations((prevReservations) =>
          prevReservations.filter((res) => res._id !== tickeId)
        );
      } else {
        throw new Error('Failed to cancel the reservation.');
      }
    } catch (err) {
      console.error('Error canceling reservation:', err.message);
      alert('Unable to cancel the reservation. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading reservations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="reservation-list">
      <h2 className='text-3xl text-primary font-bold'>Your Reservations</h2>
      {reservations.length > 0 ? (
        reservations.map((reservation) => (
          <ReservationCard
            key={reservation._id}
            reservation={reservation}
            onCancel={handleCancel}
          />
        ))
      ) : (
        <p>You have no reservations.</p>
      )}
    </div>
  );
};

export default ReservationList;
