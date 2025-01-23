import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/CommentsPage.css';
import axiosInstance from '../api/axiosInstance'
import Header from '../components/header';
import Footer from '../components/footer';



const CommentsPage: React.FC = () => {
  const { postId, postTitle } = useParams<{ postId: string; postTitle: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);
  const decodedPostTitle = decodeURIComponent(postTitle || ''); // Decode the title from the URL params
  const location = useLocation();
  const post = location.state?.post; // Check if the state contains 'post'

useEffect(() => {
    console.log("Fetching comments for postId:", postId); // Log the postId

    if (postId) {
      axiosInstance
            .get(`/comments/comment/${postId}`) // Updated route
            .then((response) => {
                console.log("Fetched comments:", response.data); // Log the response to check if data is correct
                setComments(response.data); 
            })
            .catch((error) => {
                console.error(`Error fetching comments for post ${postId}:`, error);
            });
    }
}, [postId]);

  return (
    <div className="comments-page">
      <Header />
      <button onClick={() => navigate('/')} className="btn btn-secondary">
        Back
      </button>
      <h3>Comments for Post: {decodedPostTitle}</h3>
      {/* <h3>Comments for Post {postId}</h3> */}
      <ul>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.commenter}:</strong> {comment.content}
            </li>
          ))
        )}
      </ul>
      <Footer />
    </div>
  );
};

export default CommentsPage;
