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

function App() {
  // const { authData, clearAuthData, saveAuthData } = useContext(AuthContext);

  // useEffect(() => {
  //   const ls = { ...localStorage };

  //   console.log(ls);
  //   if (Object.keys(ls).length !== 0) {
  //     setAuth(ls);
  //   }
  // }, []);

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
            <Route path="/admin" element={<UsersList />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/matches" element={<Matches />} />
            <Route path="/create-match" element={<CreateMatchEvent />} />
            <Route path="/create-stadium" element={<CreateStadiumEvent />} />
            <Route path="/add-team" element={<AddTeam />} />
            <Route path="/add-referee" element={<AddReferee />} />

            <Route path="/edit-match/:id" element={<EditMatchEvent />} />

            <Route path="/match-details/:id" element={<MatchDetails />} />

            <Route path="/profile" element={<EditProfile />} />
            <Route path="/tickets" element={<ReservationList />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
