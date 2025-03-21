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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Image preview state

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
      // Create a preview URL
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setPreviewImage(imageUrl);
      
    } else {
      setProfileImage(null);
      setPreviewImage(null);
    }
  };

  // Upload profile image function
  const uploadImage = async () => {
    if (!profileImage) return null;

    const formData = new FormData();
    formData.append("file", profileImage);

    try {
      const response = await axiosInstance.post("/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Image Upload Response:", response.data); // Debugging line

      return response.data.imageUrl; // Ensure this matches what the backend sends
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    let imageUrl = await uploadImage();
    if (imageUrl == null) {
      imageUrl = ''; // Set a default image URL if none is uploaded
    }
  

    let response
    
    try {
      // POST request to backend
      response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        imageUrl,
      });
      console.log("Request Data Sent to /auth/register:", response); // Debugging line

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

    // Handle errors with better specificity
    if (axios.isAxiosError(err)) {
      // If error is a 400 status and response contains specific error message
      if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || 'Failed to sign up. Please try again.';
        if (errorMessage === 'User already exists') {
          setError('User already exists! Please sign in or try another email.');
        } else {
          setError(errorMessage); // General error message
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } else {
      setError('An unknown error occurred.');
    }

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light"
    style={{ backgroundImage: 'url(/dogs_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
          {/* Profile Picture Upload */}
          <div className="mb-3">
            <label className="form-label">Upload Profile Picture (Optional)</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
          </div>
          {/* Image Preview */}
          {previewImage && (
            <div className="mb-3 text-center">
              <img src={previewImage} alt="Profile Preview" className="img-fluid rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            </div>
          )}
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