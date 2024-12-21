import React, { useState, useEffect } from 'react';
import '../../styles/reservation_card.css';

const ReservationCard = ({ reservation, onCancel }) => {
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    const eventDate = new Date(reservation.matchId.date);
    const currentDate = new Date();
    const diffInDays = (eventDate - currentDate) / (1000 * 3600 * 24);

    setCanCancel(diffInDays >= 3);
  }, [reservation.matchId.date]);

  const handleCancel = () => {
    if (canCancel) {
      onCancel(reservation._id, reservation.seatId.reservationId);
    }
  };

  return (
    <div className="reservation-card">
      <h3>Ticket ID: {reservation.seatId.reservationId}</h3>
      <div className="match-details">
        <p>
          <strong>Match:</strong> {reservation.matchId.homeTeam.name} vs{' '}
          {reservation.matchId.awayTeam.name}
        </p>
        <p>
          <strong>Date:</strong> {reservation.matchId.date}
        </p>
        <p>
          <strong>Time:</strong> {reservation.matchId.time}
        </p>
        <p>
          <strong>Venue:</strong> {reservation.matchId.matchVenue.name}
        </p>
        <p>
          <strong>Reserved Seats:</strong>{' '}
          {reservation.seatId.row + '-' + reservation.seatId.column}
        </p>
      </div>

      <button
        className={canCancel ? 'cancel-button' : 'cancel-button disabled'}
        onClick={handleCancel}
        disabled={!canCancel}
      >
        {canCancel ? 'Cancel Reservation' : 'Cannot Cancel (Less than 3 Days)'}
      </button>
    </div>
  );
};

export default ReservationCard;
