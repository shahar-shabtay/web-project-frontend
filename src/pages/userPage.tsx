import React, { useState , useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Cookies from "js-cookie";
import Posts from '../components/posts';
import axiosInstance from '../api/axiosInstance'

const UserPage = () => {
  
  interface Post {
    _id: string;
    title: string;
    content: string;
    owner: string;
    comments?: { commenter: string; content: string }[];
    commentCount?: number;
    likesCount: number;
    isLiked: boolean;
    imageUrl?: string;
  }
  
  interface UserInfo {
    email: string;
    username: string;
    profileImage?: string; // Adding profileImage field
  }
    
  const [posts, setPosts] = useState<Post[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '' });
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  
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

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      
      // Ensure imageUrl is set (default fallback if missing)
      const userData = {
        ...response.data,
        profileImage: response.data.imageUrl || '/small_logo.png', // Use a default image if profileImage is not available
      };

      setFormData({ username: response.data.username });
      setUserInfo(userData); // Set the full user info with the imageUrl
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user info');
    }
  };

  const updateUserInfo = async () => {
    try {
      let imageUrl = userInfo?.profileImage || ''; // Keep old image if no new image is selected
  
      if (newProfileImage) {
        const formData = new FormData();
        formData.append('file', newProfileImage);
  
        // Upload the new image and get the image URL
        const imageResponse = await axiosInstance.post('/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        imageUrl = imageResponse.data.imageUrl; // New image URL returned from server
      }
  
      // Update user info (including the new image URL) in the DB
      await axiosInstance.put(
        `/users/${userId}`,
        {
          ...formData,
          imageUrl: imageUrl, // Use imageUrl instead of profileImage
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      // Re-fetch the user info to get the updated image
      fetchUserInfo();
  
      // Close the edit mode
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update user info');
    }
  };

      
  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const response = await axiosInstance.get(`/posts`, {
        params: { owner: userId },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const fetchedPosts = response.data;
      setPosts(fetchedPosts);
      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user posts');
    }
  };

  // Fetch posts and user info when the component mounts
  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewProfileImage(file);

      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
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
              <div className="mb-3 text-center">
              {userInfo?.profileImage ? (
                <img
                  src={userInfo.profileImage}
                  alt="Profile"
                  className="img-fluid rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ) : (
                <p>No profile image</p>
              )}
            </div>
              {/* Editing Profile */}
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="username"
                    className="form-control mb-2"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <div className="mb-2">
                    <label htmlFor="profileImage" className="btn btn-secondary btn-sm">
                      Change Profile Image
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                    {previewImage && <img src={previewImage} alt="Preview" className="mt-2" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                  </div>
                  <button className="btn btn-success btn-sm" onClick={updateUserInfo}>
                    Save
                  </button>
                </div>
              ) : (
                <p className="card-text">
                  <strong>Username:</strong> {userInfo.username}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="container mt-5">
        <div className="card p-3">
          <div className="card-body">
            <h5 className="card-title text-center mb-4">User Posts</h5>
            <div className="w-100">
            <Posts 
                 posts={posts} 
                //  currentPage={1} 
                //  setCurrentPage={() => {}} 
                //  totalPages={1} 
               />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
  
  export default UserPage;
  