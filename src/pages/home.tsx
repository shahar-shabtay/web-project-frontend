import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Header from '../components/header';
import axiosInstance from '../api/axiosInstance'
import CreatePostPage from './CreatePostPage';
import Posts from '../components/posts';

const Home: React.FC = () => {
  interface Post {
    _id: string;
    title: string;
    content: string;
    comments?: { commenter: string; content: string }[];
    commentCount?: number;
  }

  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts when the component mounts
  useEffect(() => {
    axiosInstance
      .get('/posts')
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the posts:', error);
      });
  }, []);

  return (
    <div className="d-flex flex-column align-items-center bg-light vh-100 p-4">
      <Header />
      <div className="card-container">
        <img src="/full_logo.png" alt="Logo" className="full-logo" />
        <CreatePostPage />
        <Posts posts={posts} />
      </div>
    </div>
  );
};

export default Home;
