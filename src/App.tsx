import React, { useState, useEffect } from 'react';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import Home from './components/Home/home';
import CommentsPage from './components/CommentsPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const accessToken = Cookies.get('accessToken');
    return accessToken !== undefined;
  });

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = Cookies.get('accessToken');
      setIsAuthenticated(accessToken !== undefined);
    };
    window.addEventListener('cookiechange', checkAuth);
    return () => {
      window.removeEventListener('cookiechange', checkAuth);
    };
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/comments/:postId" element={<CommentsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;