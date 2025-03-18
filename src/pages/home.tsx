import React, { useEffect, useState } from 'react';
import '../styles/home.css';
import Header from '../components/header';
import axiosInstance from '../api/axiosInstance'
import CreatePostPage from './CreatePostPage';
import PagedPosts from '../components/pagedPosts';

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

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10; // Limit per page

  // Fetch posts when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`/posts/paging?page=${currentPage}&limit=${postsPerPage}`)
      .then((response) => {
        setPosts(response.data.data);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching the posts:', error);
      });
  }, [currentPage]);

  return (
    <div>
      <Header />
      {/* Create Post Section */}
      <div className="container mt-5 d-flex justify-content-center">
        <div className="post-card">
          <img src="/full_logo.png" alt="Logo" className="logo-img" />
          <CreatePostPage />
        </div>
      </div>
      
      {/* Posts Section */}
      <div className="container mt-5">
        <div className="post-list">
          <PagedPosts posts={posts} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default Home;
