import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CommentsPage.css';
import axios from 'axios';

const CommentsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<any[]>([]);

useEffect(() => {
    console.log("Fetching comments for postId:", postId); // Log the postId

    if (postId) {
        axios
            .get(`http://localhost:3000/comments/comment/${postId}`) // Updated route
            .then((response) => {
                console.log("This is post id from comment.tsx: ${postId}")
                console.log("Fetched comments:", response.data); // Log the response to check if data is correct
                setComments(response.data); // Assuming API returns an array of comments
            })
            .catch((error) => {
                console.error(`Error fetching comments for post commentPage ${postId}:`, error);
            });
    }
}, [postId]);

  return (
    <div className="comments-page">
      <button onClick={() => navigate('/')} className="btn btn-secondary">
        Back
      </button>
      <h3>Comments for Post {postId}</h3>
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
  );
};

export default CommentsPage;
