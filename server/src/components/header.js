//React Components
import Nav from 'react-bootstrap/Nav';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Axios from 'axios';
import { useState } from 'react';
// import Modal from "react-bootstrap/Modal";
import { useContext } from 'react';
//Components
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AuthContext } from './context/auth_provider';

//Images
import logo from '../images/Logo.png';
import { AiOutlineSearch } from 'react-icons/ai';

//Styles
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const { authData, clearAuthData, saveAuthData } = useContext(AuthContext);

  const logOut = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="topArea">
        <div className="logo">
          <Link title="Tazkarti" to="/">
            <img src={logo} alt="Tazkarti Logo" width={130} height={130} />
          </Link>
        </div>

        {authData.user === null ? (
          <div className="login">
            <span
              className="username"
              onClick={() => {
                navigate('/login');
              }}
            >
              Login
            </span>
            <span
              className="username"
              onClick={() => {
                navigate('/SignUp');
              }}
            >
              Sign Up
            </span>
          </div>
        ) : (
          <div className="login">
            {/* <span className="username">{authData["email"][0]}</span> */}
            <span className="username" id="user-char">
              {authData.user.name !== null && authData.user.name}
            </span>
            <span className="username" onClick={logOut}>
              Log Out
            </span>
          </div>
        )}
      </div>
      <div className="bottomArea">
        <nav className="navbar">
          {(() => {
            // console.log(authData["userType"]);
            if (authData.user !== null) {
              switch (authData.user.userType) {
                case 'admin':
                  return (
                    <div className="navbarlinks">
                      <Link to="/admin">Admin</Link>
                    </div>
                  );
                case 'manager':
                  return (
                    <div className="navbarlinks">
                      <Link to="/matches">Matches</Link>
                      <Link to="/create-match">Create Match</Link>
                      <Link to="/create-stadium">Create Stadium</Link>
                      <Link to="/add-team">Add Team</Link>
                      <Link to="/add-referee">Add Referee</Link>
                    </div>
                  );
                case 'fan':
                  return (
                    <div className="navbarlinks">
                      <Link to="/matches">Matches</Link>
                      <Link to="/profile">Edit Profile</Link>
                      <Link to="/tickets">My Tickets</Link>
                    </div>
                  );
                default:
                  return <div className="navbarlinks"></div>;
              }
            } else {
              return (
                <div className="navbarlinks">
                  <Link to="/matches">Matches</Link>
                </div>
              );
            }
          })()}
        </nav>
      </div>
    </header>
  );
};

export default Header;
