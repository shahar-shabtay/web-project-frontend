import React from 'react';
import '../index.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="/small_logo.png" alt="Logo" className="logo" />
          <h1 className="headline">DoggoDopt</h1>
        </div>
        <nav>
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
