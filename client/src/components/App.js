import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/login';
import { AuthProvider } from './context/auth_provider';
import Header from './header';
import Matches from './match/matches';
import MatchDetails from './match/match_details';
import Footer from './footer';
import Home from './home/home';
import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/auth_provider';
import { useContext } from 'react';
import SignUp from './signup/signup';
import UsersList from './admin/user_card_list';
import CreateMatchEvent from './manager/create_match_event';
import EditMatchEvent from './manager/edit_match_event';
import CreateStadiumEvent from './manager/create_stadium_event';
import EditProfile from './customer/edit_profile';
import ReservationList from './customer/reservation_card_list';
import AddTeam from './manager/add_team_event';
import AddReferee from './manager/add_referee';
import { Helmet } from 'react-helmet';
// const baseUrl = 'https://not-tazkarti-back-production.up.railway.app';

const baseUrl = 'http://localhost:8080';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Helmet>
            <title>Not Tazkarti</title>
            <link
              rel="icon"
              href="../images/Logo_Small.png"
              sizes="32x32"
              type="image/png"
            />
          </Helmet>

          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<UsersList baseUrl={baseUrl} />} />

            <Route path="/login" element={<Login baseUrl={baseUrl} />} />
            <Route path="/signup" element={<SignUp baseUrl={baseUrl} />} />

            <Route path="/matches" element={<Matches baseUrl={baseUrl} />} />
            <Route
              path="/create-match"
              element={<CreateMatchEvent baseUrl={baseUrl} />}
            />
            <Route
              path="/create-stadium"
              element={<CreateStadiumEvent baseUrl={baseUrl} />}
            />
            <Route path="/add-team" element={<AddTeam baseUrl={baseUrl} />} />
            <Route
              path="/add-referee"
              element={<AddReferee baseUrl={baseUrl} />}
            />

            <Route
              path="/edit-match/:id"
              element={<EditMatchEvent baseUrl={baseUrl} />}
            />

            <Route
              path="/match-details/:id"
              element={<MatchDetails baseUrl={baseUrl} />}
            />

            <Route
              path="/profile"
              element={<EditProfile baseUrl={baseUrl} />}
            />
            <Route
              path="/tickets"
              element={<ReservationList baseUrl={baseUrl} />}
            />
          </Routes>

          <div className="container relative bottom-0">
            <div className="textblock">
              <h2 id="imagetext">Contact US</h2>
              <p id="footertext">Phone Number: 123456789</p>
              <p id="footertext">Email: NotTazkarti@gmail.com</p>
            </div>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
