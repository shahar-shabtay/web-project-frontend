import React from 'react';
import '../index.css'
import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {

  // const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear the authentication cookies
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });

    // Redirect to the sign-in page
    // navigate('/signin');
  };

  return (
    <header className="header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/small_logo.png" alt="Logo" className="logo" />
          <h1 className="headline">DoggoDopt</h1>
        </div>
        <nav>
          <a href="/" className="nav-link">Home</a>
          <a href="/user" className="nav-link">My Space</a>
          <a href="/chat" className="nav-link">Our Chat</a>
          <a href="/signin" className="nav-link" onClick={handleSignOut}>SignOut</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
