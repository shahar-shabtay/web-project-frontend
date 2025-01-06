import React, { useState , useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import Cookies from "js-cookie";

const UserPage = () => {
    interface UserInfo {
      email: string;
      username: string;
    }
    
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState('');
  
    // Function to fetch user info
    const fetchUserInfo = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
  
        if (!accessToken) {
          throw new Error('Access token not found');
        }
  
        // Decode the JWT token to extract user ID
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userId = payload._id;
        
        if (!userId) {
          throw new Error('User ID not found in token');
        }
  
        // Fetch user info from backend
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: {Authorization: `Bearer ${accessToken}`}
        });
  
        setUserInfo(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user info');
      }
    };
  
    useEffect(() => {
      fetchUserInfo();
    }, []);
  
    return (
      <div>
        <Header />
          <div className="container mt-5">
            <h2 className="mb-4">User Information</h2>
            {error && <p className="text-danger">{error}</p>}
            {userInfo ? (
            <div className="card p-3">
              <div className="card-body">
                <p className="card-text"><strong>Email:</strong> {userInfo.email}</p>
                <p className="card-text"><strong>Username:</strong> {userInfo.username}</p>
              </div>
            </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        <Footer />
      </div>
    );
  };
  
  export default UserPage;
  