import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Header from '../components/header';
import axiosInstance from '../api/axiosInstance'
import CreatePostPage from './CreatePostPage';
import Posts from '../components/posts';

interface Post {
  _id: string;
  title: string;
  content: string;
  owner: string;
  comments?: { commenter: string; content: string }[];
  commentCount?: number;
  likesCount: number;
}

const Home: React.FC = () => {
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
    <div>
      <Header />
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card p-3 w-100 text-center">
          <div className="card-body">
            <img src="/full_logo.png" alt="Logo" className="img-fluid mb-3" style={{ height: '200px' }} />
            <div className="w-100">
              <CreatePostPage />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mt-5">
        <div className="card p-3">
          <div className="card-body">
            <div className="w-100">
              <Posts posts={posts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
