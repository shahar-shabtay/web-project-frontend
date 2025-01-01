import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../header';
import axios from 'axios';
import CreatePostPage from '../../pages/CreatePostPage';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch posts when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3000/posts')
      .then((response) => {
        const fetchedPosts = response.data;
        setPosts(fetchedPosts);

        // Fetch comment counts for each post
        fetchedPosts.forEach((post: any) => {
          axios
            .get(`http://localhost:3000/comments/comment/${post._id}`)
            .then((commentResponse) => {
              // Update the post with its comment count
              setPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p._id === post._id
                    ? { ...p, commentCount: commentResponse.data.length }
                    : p
                )
              );
            })
            .catch((error) => {
              console.error(`Error fetching comments for post ${post._id}:`, error);
            });
        });
      })
      .catch((error) => {
        console.error('Error fetching the posts:', error);
      });
  }, []);

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
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: [...(post.comments || []), response.data],
                    commentCount: (post.commentCount || 0) + 1, // Update comment count
                  }
                : post
            )
          );
          setNewComments({ ...newComments, [postId]: '' });
          setShowSuccess(true);
        })
        .catch((error) => {
          console.error('There was an error adding the comment:', error);
        });
    }
  };
  
  return (
    <div className="d-flex flex-column align-items-center bg-light vh-100 p-4">
      <Header />
      {showSuccess && (
        <div className="success-popup">
          <p>Comment added successfully!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowSuccess(false)}
          >
            OK
          </button>
        </div>
      )}
      <div className="card-container">
        <img src="/full_logo.png" alt="Logo" className="full-logo" />
        <CreatePostPage />
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
      </div>
    </div>
  );
};

export default Home;
