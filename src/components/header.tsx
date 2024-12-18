import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-subtle text-primary-emphasis py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
       <div className="d-flex align-items-center">
          <img src="/logo2.png" alt="Logo" className="me-1" style={{ height: '50px' }} />
          <h1 className="h4">Wusha</h1>
        </div>
        <nav>
          <a href="/" className="text-primary-emphasis mx-2 text-decoration-none">Home</a>
          <a href="/about" className="text-primary-emphasis mx-2 text-decoration-none">About</a>
          <a href="/contact" className="text-primary-emphasis mx-2 text-decoration-none">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;