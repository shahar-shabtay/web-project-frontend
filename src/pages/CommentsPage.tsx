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

useEffect(() => {  
    if (postId) {
      axiosInstance
            .get(`/comments/comment/${postId}`) // Updated route
            .then((response) => {
                setComments(response.data); 
            })
            .catch((error) => {
                console.error(`Error fetching comments for post ${postId}:`, error);
            });
    }
}, [postId]);

  return (
    <div>
      <Header />
    <div className="comments-page">
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
    </div>
    <Footer />
    </div>
  );
};

export default CommentsPage;
