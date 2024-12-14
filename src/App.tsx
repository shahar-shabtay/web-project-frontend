import React from 'react';
import Header from './components/header';
import Footer from './components/footer';

const App: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="container py-4">
          <h2>Welcome to the Wusha website!</h2>
          <p>This is the main content of the app.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
