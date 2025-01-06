import React, { useState } from 'react';
import './Home/home.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  commentCount?: number;
  comments?: { commenter: string; content: string }[];
}

interface PostsProps {
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleComment = (postId: string) => {
    const commentContent = newComments[postId]?.trim();
    if (commentContent) {
      const commenter = 'shahar';
      console.log("Adding comment to postId:", postId); // Log the postId
      axios
        .post(`http://localhost:3000/comments`, {
          commenter,
          postID: postId,
          content: commentContent,
        })
        .then((response) => {
          console.log("Comment added:", response.data); // Log the added comment data
          // Update post state after comment is added
          setNewComments({ ...newComments, [postId]: '' });
        })
        .catch((error) => {
          console.error('There was an error adding the comment:', error);
        });
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="post border rounded p-3 mb-3">
          <h4 className="post-title mb-2">{post.title}</h4>
          <p className="post-content mb-2">{post.content}</p>
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
    </div>
  );
};

export default Posts;
