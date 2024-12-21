import React, { useState, useEffect } from 'react';
import '../../styles/reservation_card.css';

const ReservationCard = ({ reservation, onCancel }) => {
  const [canCancel, setCanCancel] = useState(false);

  useEffect(() => {
    // Calculate if the cancellation is within the allowed period (3 days before the event)
    const eventDate = new Date(reservation.matchId.date);
    const currentDate = new Date();
    const diffInDays = (eventDate - currentDate) / (1000 * 3600 * 24); // Difference in days

    // Set whether the cancellation is allowed (at least 3 days before the event)
    setCanCancel(diffInDays >= 3);
  }, [reservation.matchId.date]);

  const handleCancel = () => {
    if (canCancel) {
      onCancel(reservation._id, reservation.seatId.reservationId); // Notify parent to handle cancellation
    }
  };

  return (
    <div className="reservation-card">
      <h3 className='text-xl text-primary'>Ticket ID: {reservation.seatId.reservationId}</h3>
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
        className={
          canCancel
            ? 'cancel-button bg-primary hover:bg-primary/80'
            : 'cancel-button disabled bg-primary hover:bg-primary/80'
        }
        onClick={handleCancel}
        disabled={!canCancel}
      >
        {canCancel ? 'Cancel Reservation' : 'Cannot Cancel'}
      </button>
    </div>
  );
};

export default ReservationCard;
