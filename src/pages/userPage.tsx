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
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '' });
  
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

    // Function to fetch user info
    const fetchUserInfo = async () => {
      try {
  
  
        // Fetch user info from backend
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
          headers: {Authorization: `Bearer ${accessToken}`}
        });
  
        setFormData({ username: response.data.username });
        setUserInfo(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user info');
      }
    };
  
    // Function to update user info
    const updateUserInfo = async () => {
      try {
        await axios.put(`http://localhost:3000/users/${userId}`, formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setUserInfo(prev => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        setError('Failed to update user info');
      }
    };

    useEffect(() => {
      fetchUserInfo();
    }, []);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
      <div>
        <Header />
        <div className="container mt-5">
          {error && <p className="text-danger">{error}</p>}
          {userInfo ? (
            <div className="card p-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <br />
                  <h5 className="card-title">User Information</h5>
                  <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                <p className="card-text"><strong>Email:</strong> {userInfo.email}</p>
                {isEditing ? (
                  <div>
                    <input type="text" name="username" className="form-control mb-2" value={formData.username}
                      onChange={handleChange}/>
                    <button className="btn btn-success btn-sm" onClick={updateUserInfo}>Save</button>
                  </div>
                ) : (<p className="card-text"><strong>Username:</strong> {userInfo.username}</p>)}
              </div>
            </div>
            ) : (<p>Loading...</p>)}
        </div>
        {posts.map((post) => (
          <div key={post._id} className="post border rounded p-3 mb-3">
            <h4 className="post-title mb-2">{post.title}</h4>
            <p className="post-description mb-2">{post.description}</p>
            <div className="post-actions">
              <div className="comment-section">
                <input
                  type="text"
                  value={newComments[post._id] || ''}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [post._id]: e.target.value })
                  }
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button
                  className="comment-button"
                  onClick={() => handleComment(post._id)}
                >
                  Comment
                </button>
              </div>
              <div className="comments-overview">
                <span>{post.commentCount || 0} comments</span>
                <button
                  className="btn btn-link"
                  onClick={() => navigate(`/comments/${post._id}`)}
                >
                  View Comments
                </button>
              </div>
            </div>
          </div>
        ))}
        <Footer />
      </div>
    );
  };
  
  export default UserPage;
  