import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import '../../styles/match_details.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Timer, Calendar } from 'lucide-react';

const MatchDetails = ({ baseUrl }) => {
  const { id } = useParams();
  const [seatingLayout, setSeatingLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    pin: '',
  });
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const [errors, setErrors] = useState({
    cardNumber: '',
    pin: '',
  });
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
  const token = authData.token;

  useEffect(() => {
    const fetchSeatingLayout = async () => {
      try {
        const response = await axios.get(`${baseUrl}/matches/get-seats/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
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

    socket.on('seat-reserved', async (message) => {
      const response = await axios.get(`${baseUrl}/matches/get-seats/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
          setShowPopup(true);
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
    setErrors({
      cardNumber: '',
      pin: '',
    });
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePaymentSubmit = async () => {
    try {
      const newErrors = {};
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Card Number cannot be empty.';
      }

      const regex = /^[0-9]+$/;
      if (!regex.test(cardDetails.cardNumber.trim())) {
        newErrors.cardNumber =
          'Card number can only contain digits characters.';
      }

      if (!regex.test(cardDetails.pin.trim())) {
        newErrors.pin = 'PIN can only contain digits characters.';
      }

      if (!cardDetails.pin.trim()) {
        newErrors.pin = 'PIN cannot be empty.';
      }

      if (cardDetails.cardNumber.trim().length != 16) {
        newErrors.cardNumber = 'Card Number must be 16 characters';
      }

      if (cardDetails.pin.trim().length != 3) {
        newErrors.pin = 'PIN must be 3 digits';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const requestBody = {
        userId: authData.user._id,
        row: selectedSeat.row,
        column: selectedSeat.column,
        matchId: id,
        cardNumber: cardDetails.cardNumber,
        pinNumber: cardDetails.pin,
      };

      const response = await axios.post(
        `${baseUrl}/seats/reserve`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSeatingLayout((prevLayout) => {
          const updatedSeats = [...prevLayout.seats];
          updatedSeats[selectedSeat.row - 1][selectedSeat.column - 1] = true;
          return {
            ...prevLayout,
            seats: updatedSeats,
          };
        });
        if (socket) {
          socket.emit('reserve-seat', 'message');
        }
        handlePopupClose();
      } else {
        alert(`Error reserving seat: ${response.data.message}`);
      }
      handlePopupClose();
    } catch (error) {
      handlePopupClose();

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
      <div className="match-container flex flex-col gap-5">
        <table className="w-full table-fixed border-collapse">
          <tr className="*:text-xl *:font-bold">
            <td>{teamA.name}</td>
            <td>vs</td>
            <td>{teamB.name}</td>
          </tr>
        </table>

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
              <img
                src="/stadium.jpg"
                alt="stadium-icon"
                width={20}
                height={20}
              />{' '}
              Venue
            </th>
            <td>{venue.name}</td>
          </tr>

          <div className="my-2"></div>

          <tr className="">
            <th className="flex gap-2">
              <img
                src="/referee.png"
                alt="stadium-icon"
                width={20}
                height={20}
              />
              Main Referee
            </th>
            <td>{mainReferee.name}</td>
          </tr>

          <div className="my-2"></div>

          <tr className="">
            <th className="flex gap-2">
              <img
                src="/referee.png"
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
              <img
                src="/referee.png"
                alt="referee-icon"
                width={20}
                height={20}
              />{' '}
              Second Linesman
            </th>
            <td>{secondLinesman.name}</td>
          </tr>
        </table>
      </div>

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
          <div className="popup-content lg:w-1/4">
            <h3>
              Reserve Seat {selectedSeat.row}-{selectedSeat.column}
            </h3>
            <label>Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              className="w-full"
              value={cardDetails.cardNumber}
              onChange={handleCardDetailsChange}
              placeholder="Enter your card number"
            />
            {errors.cardNumber && (
              <p className="error-message">{errors.cardNumber}</p>
            )}{' '}
            {/* Show cardNumber error */}
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
            {errors.pin && <p className="error-message">{errors.pin}</p>}{' '}
            {/* Show pin error */}
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
