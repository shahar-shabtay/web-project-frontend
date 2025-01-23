import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axiosInstance from '../api/axiosInstance'
// import { AxiosError } from 'axios'
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin , CredentialResponse } from '@react-oauth/google';

const SignIn: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  if (!GOOGLE_CLIENT_ID) {
    // throw new Error('Missing Google Client ID');
    console.log('Missing Google Client ID');
  }

  // Handle a submit of sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = { email, password };

    try {
        const response = await axiosInstance.post('/auth/login', requestBody, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });

        if (response.status === 200) {
            const data = response.data;
            Cookies.set('accessToken', data.accessToken, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('refreshToken', data.refreshToken, { path: '/', secure: true, sameSite: 'Strict' });

            onSignIn();
            setSuccess('Login successful! Redirecting...');
            setError('');
            setTimeout(() => navigate('/'), 1000);
        } else {
            setSuccess('');
            setError('Email or password is not correct.');
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverError = error.response.data?.error;
            setError(serverError || 'An error occurred. Please try again later.');
        } else {
            setError('An error occurred. Please try again later.');
        }
    }
  };

  // Handle a google sign in
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    let res;

    res = await axiosInstance.post('/auth/google', {credential: credentialResponse.credential,});

    try {
      
      // If this is a new user, sign up first
      if (res.status === 201) {
        res = await axiosInstance.post('/auth/google', {credential: credentialResponse.credential,});
      } 
  
      const data = res.data;
      Cookies.set('accessToken', data.accessToken, { path: '/', secure: true, sameSite: 'Strict' });
      Cookies.set('refreshToken', data.refreshToken, { path: '/', secure: true, sameSite: 'Strict' });
  
      onSignIn();
      setSuccess('Login successful! Redirecting...');
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.log('Login error:', error);
      setSuccess('');
      setError('An error occurred. Please try again later.');
    }

  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> 
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
            <button type="submit" className="btn btn-primary w-100 mb-3">Sign In</button>
          </form>
          <div className="d-flex justify-content-center">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} width={352}   />
          </div>
          <div className="mt-3 text-center">
            <p className="mt-2">
              Don't have an account? <a href="/signup" className="text-decoration-none">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignIn;
