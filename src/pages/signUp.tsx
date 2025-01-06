import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'
import axios from 'axios';

const SignUp: React.FC = () => {

  // Variables for form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    let response
    
    try {
      // POST request to backend
      response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
      });

      // Handle success
      if (response.status === 201 || response.status === 200) {
        setSuccess('Signup successful! Redirecting...');
        setError('');
        setTimeout(() => {
          window.location.href = '/signin'; // Redirect to sign-in page
        }, 2000);
      }

    } catch (err) {
      setSuccess('');

      // Handle errors
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setError('User already exists! please sign in or try another email.');
      } else {
        setError('Failed to sign up. Please try again.');
      }

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Username</label>
            <input type="text" id="name" className="form-control"
              placeholder="Enter a username" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" id="email" className="form-control"
              placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control"
              placeholder="Enter a strong password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input type="password" id="confirmPassword" className="form-control"
              placeholder="Confirm your password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        {error && <div className="text-danger mt-3 text-center">{error}</div>}
        {success && <div className="text-success mt-3 text-center">{success}</div>}
        <div className="mt-3 text-center">
          <p className="mb-0">
            Already have an account? <a href="/signin" className="text-decoration-none">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;