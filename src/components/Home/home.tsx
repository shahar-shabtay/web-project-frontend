import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../header';
import axios from 'axios';
import CreatePostPage from '../../pages/CreatePostPage';
import Posts from '../posts';

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
    axios
      .get('http://localhost:3000/posts')
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
