import React from 'react';
import Header from './header';
import Footer from './footer';

const home: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="container py-4">
          <h2>Welcome to the Wusha App!</h2>
          <p>This is the main content of the app.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default home;