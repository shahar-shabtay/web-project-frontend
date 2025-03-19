import React, { useState, useEffect } from 'react';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ChatPage from './pages/chatPage';
import UserPage from './pages/userPage';
import Home from './pages/home';
import CommentsPage from './pages/CommentsPage';
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
            <Route path="/comments/:postId" element={isAuthenticated ? <CommentsPage /> : <Navigate to="/signin" />} />
            <Route path="/comments/:postId/:postTitle" element={isAuthenticated ? <CommentsPage /> : <Navigate to="/signin" />} />
            <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/signin" />} />
            <Route path="/user" element={isAuthenticated ? <UserPage /> : <Navigate to="/signin" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;