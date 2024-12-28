import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../header';
import axios from 'axios';
import CreatePostPage from '../../pages/CreatePostPage';

const Home: React.FC = () => {
  // State to manage the posts
  const [posts, setPosts] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);


  // Fetch posts when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3000/posts') // Backend URL
      .then((response) => {
        console.log('Fetched Posts:', response.data);
        setPosts(response.data); // Set fetched posts
      })
      .catch((error) => {
        console.error('Error fetching the posts:', error);
      });
  }, []);
          
  // // Handle like functionality - TO DO after add like to backend 
  // const handleLike = (postId: string) => {
  //   axios.put(`http://localhost:3000/posts/${postId}/like`) // Replace with your backend URL
  //     .then((response) => {
  //       setPosts(posts.map(post => post._id === postId ? response.data : post)); // Update posts after like
  //     })
  //     .catch((error) => {
  //       console.error('There was an error liking the post:', error);
  //     });
  // };

// Handle comment submission
      // Replace `commenter` with the current user's name dynamically
      // TO DO - after finish user parts 
      //const commenter = currentUserName; // Assume `currentUserName` holds the logged-in user's name
  const handleComment = (postId: string) => {
    const commentContent = newComments[postId]?.trim(); // Get the comment for this post
    if (commentContent) {
      const commenter = 'shahar'; // Replace with dynamic user name in the future
      axios
        .post(`http://localhost:3000/comments`, {
          commenter, // Dynamic commenter
          postID: postId, // The post ID
          content: commentContent, // The comment entered in the front end
        })
        .then((response) => {
          console.log('Response from backend:', response.data);

          // Update the posts state to include the new comment
          setPosts(
            posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: [...(post.comments || []), response.data],
                  }
                : post
            )
          );

          // Clear the specific input field for this post
          setNewComments({ ...newComments, [postId]: '' });

          setShowSuccess(true); // Show success popup
        })
        .catch((error) => {
          console.error('There was an error adding the comment:', error);
          alert('Failed to add comment. Please try again.'); // Error message
        });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center bg-light vh-100 p-4">
      <Header />

      {/* Success Popup */}
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
        <img
          src="/full_logo.png"
          alt="Logo"
          className="full-logo"
        />

        <CreatePostPage /> {/* This is where CreatePostPage is used to handle post creation */}

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

              <div className="comments">
                {post.comments &&
                  post.comments.map((comment: any, index: number) => (
                    <p key={index} className="comment">
                      <strong>{comment.commenter}:</strong> {comment.content}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
