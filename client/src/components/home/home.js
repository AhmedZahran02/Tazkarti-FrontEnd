// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.css'; // Add this for styling
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';

const Home = () => {
  const { authData, clearAuthData, saveAuthData } = useContext(AuthContext);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content bg-white/80 p-8 rounded-2xl ">
          <h1 className="text-4xl text-primary">Welcome to Tazkarti</h1>
          <p className="hero-content text-black">
            Find your perfect matches, book tickets, and enjoy the game!
          </p>
          <Link
            to="/matches"
            className={` ${
              authData.user && authData.user.userType === 'admin'
                ? 'hidden'
                : 'cta-button'
            }
                text-white bg-primary hover:bg-primary/80 transition-all `}
          >
            View Matches
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="text-primary text-2xl">Why Choose Tazkarti?</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3 className="text-xl text-primary">Easy Ticket Booking</h3>
            <p>Quickly browse and book tickets for your favorite matches.</p>
          </div>
          <div className="feature-item ">
            <h3 className="text-xl text-primary">Interactive Stadium Maps</h3>
            <p>Select your favorite seats with our visual stadium map.</p>
          </div>
          <div className="feature-item">
            <h3 className="text-xl text-primary">User-Friendly Interface</h3>
            <p>Enjoy a seamless experience with an intuitive design.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section
        className={`bg-primary text-white ${authData.user ? 'hidden' : 'cta'} `}
      >
        <h2 className="text-white">Ready to Join the Excitement?</h2>
        <Link
          to="/signup"
          className="cta-button text-black hover:bg-white/80 border-none transition-all"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default Home;
