import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SignIn: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = { email, password };

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });
      
      if (response.ok) {

        // Save the token in cookies
        const data = await response.json();
        Cookies.set('accessToken', data.accessToken, { path: '/', secure: true, sameSite: 'Strict' });
        Cookies.set('refreshToken', data.refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
      
        console.log(Cookies.get('accessToken'))

        onSignIn(); // Update the authentication state
        setSuccess('Login successful! Redirecting...');
        setError('');
        setTimeout(() => navigate('/'), 2000);

      } else {
        setSuccess('');
        setError('Email or password is not correct.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSuccess('');
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign In</h2>
        {error && <div className="text-danger mb-3 text-center">{error}</div>}
        {success && <div className="text-success mb-3 text-center">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
        <div className="mt-3 text-center">
          <a href="/forgot-password" className="text-decoration-none">Forgot Password?</a>
          <p className="mt-2">
            Don't have an account? <a href="/signup" className="text-decoration-none">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;