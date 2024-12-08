import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import '../../styles/match_details.css'; // Add styles for the component
import axios from 'axios';
import { io } from 'socket.io-client'; // Import socket.io-client

const baseUrl = 'https://not-tazkarti-back-production.up.railway.app'; // Adjust the base URL to your backend

const MatchDetails = () => {
  const { id } = useParams(); // Extract match ID from the URL
  const [seatingLayout, setSeatingLayout] = useState(null); // Store seating layout data
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // Manage popup visibility
  const [selectedSeat, setSelectedSeat] = useState(null); // Track selected seat
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    pin: '',
  });
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  // Use location to get passed state
  const location = useLocation();
  const {
    teamA,
    teamB,
    date,
    time,
    venue,
    mainReferee,
    firstLinesman,
    secondLinesman,
  } = location.state || {};
  const token = authData.token; // Get token from context

  useEffect(() => {
    const fetchSeatingLayout = async () => {
      try {
        const response = await axios.get(`${baseUrl}/matches/get-seats/${id}`, {
          headers: {
            'Content-Type': 'application/json', // Set content type for the request
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }); // Adjust URL based on your backend
        setSeatingLayout(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching seating data', err);
        setLoading(false);
      }
    };

    fetchSeatingLayout();

    const socket = io(baseUrl);
    setSocket(socket);

    // Listen for seat reservation updates from the server
    socket.on('seat-reserved', async (message) => {
      console.log('Seat reserved event received');
      const response = await axios.get(`${baseUrl}/matches/get-seats/${id}`, {
        headers: {
          'Content-Type': 'application/json', // Set content type for the request
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      }); // Adjust URL based on your backend
      setSeatingLayout(response.data);
    });

    // Cleanup when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleSeatSelection = (row, col) => {
    if (authData.user) {
      if (authData.user.userType === 'fan') {
        const seatStatus = seatingLayout.seats[row][col];
        if (!seatStatus) {
          setSelectedSeat({ row: row + 1, column: col + 1 });
          setShowPopup(true); // Show popup on seat selection
        } else {
          alert(`Seat (Row ${row + 1}, Column ${col + 1}) is reserved.`);
        }
      }
    } else {
      navigate('/login');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setCardDetails({ cardNumber: '', pin: '' });
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handlePaymentSubmit = async () => {
    try {
      const requestBody = {
        userId: authData.user._id,
        row: selectedSeat.row,
        column: selectedSeat.column,
        matchId: id, // Assuming `id` is the match ID from useParams
        cardNumber: cardDetails.cardNumber,
        pinNumber: cardDetails.pin,
      };

      const response = await axios.post(
        `${baseUrl}/seats/reserve`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );

      if (response.status === 200) {
        // Update the seating layout dynamically

        setSeatingLayout((prevLayout) => {
          const updatedSeats = [...prevLayout.seats];
          updatedSeats[selectedSeat.row - 1][selectedSeat.column - 1] = true; // Mark seat as reserved
          return {
            ...prevLayout,
            seats: updatedSeats,
          };
        });
        if (socket) {
          socket.emit('reserve-seat', 'message'); // Emit the reservation event to the server
        }
        handlePopupClose();
      } else {
        alert(`Error reserving seat: ${response.data.message}`);
      }
      handlePopupClose(); // Close the popup after submission
    } catch (error) {
      handlePopupClose(); // Close the popup after submission

      console.error('Error reserving seat:', error);
      alert('An error occurred while reserving the seat. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading match details...</p>;
  }

  if (!teamA || !seatingLayout) {
    return <p>Match details or seating data not found.</p>;
  }

  return (
    <div className="match-details">
      <h2>
        {teamA.name} vs {teamB.name}
      </h2>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Venue: {venue.name}</p>
      <p>Main Referee: {mainReferee.name}</p>
      <p>First Linesman: {firstLinesman.name}</p>
      <p>Second Linesman: {secondLinesman.name}</p>

      <div className="stadium-graph">
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Stadium Seating
        </h3>
        <div className="seats">
          {/* Render seats dynamically row by row */}
          {Array.from(
            { length: seatingLayout.seats[0].length },
            (_, colIndex) => (
              <div key={colIndex} className="seat-row">
                {Array.from(
                  { length: seatingLayout.seats.length },
                  (_, rowIndex) => (
                    <button
                      key={`${colIndex}-${rowIndex}`}
                      className={`seat ${
                        seatingLayout.seats[rowIndex][colIndex]
                          ? 'reserved'
                          : 'available'
                      }`}
                      onClick={() => handleSeatSelection(rowIndex, colIndex)}
                      disabled={seatingLayout.seats[rowIndex][colIndex]}
                    >
                      {rowIndex + 1}-{colIndex + 1}
                    </button>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>
              Reserve Seat {selectedSeat.row}-{selectedSeat.column}
            </h3>
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                placeholder="Enter your card number"
              />
            </label>
            <label>
              PIN:
              <input
                type="password"
                name="pin"
                value={cardDetails.pin}
                onChange={handleCardDetailsChange}
                placeholder="Enter your PIN"
              />
            </label>
            <button onClick={handlePaymentSubmit} className="submit-button">
              Submit
            </button>
            <button onClick={handlePopupClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchDetails;
