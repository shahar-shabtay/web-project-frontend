import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../header';
import axios from 'axios';

const Home: React.FC = () => {
  // State to manage the posts
  const [posts, setPosts] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>(''); // State to hold new comment

  // Fetch posts when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3000/posts') // Replace with your backend URL
      .then((response) => {
        setPosts(response.data); // Set fetched posts
      })
      .catch((error) => {
        console.error('There was an error fetching the posts:', error);
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
const handleComment = (postId: string) => {
  console.log(postId);
  if (newComment.trim()) {
      // Replace `commenter` with the current user's name dynamically
      // TO DO - after finish user parts 
      //const commenter = currentUserName; // Assume `currentUserName` holds the logged-in user's name
      const commenter = "shahar"; // Replace with dynamic user name in the future
      axios.post(`http://localhost:3000/comments`, {
          commenter, // Dynamic commenter
          postID: postId, // The post ID
          content: newComment // The comment entered in the front end
      })
      .then((response) => {
          console.log('Response from backend:', response.data);

          // Update the posts state to include the new comment
          setPosts(posts.map(post => 
              post._id === postId 
                  ? { ...post, comments: [...(post.comments || []), response.data] } 
                  : post
          ));

          setNewComment(''); // Clear input field

          // Display success message
          alert('Comment added successfully!'); // Simple popup message
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
      <div className="card-container">
        <h2 className="text-center mb-4">Share, Like, and Comment on Posts</h2>
        <button className="add-post-btn">Add New Post</button>

        {/* Render Posts */}
        {posts.map((post) => (
          <div key={post._id} className="post border rounded p-3 mb-3">
            <h4 className="post-title mb-2">{post.title}</h4>
            <p className="post-description mb-2">{post.description}</p>

            <div className="post-actions">
              {/* Like Button */}
              <button className="like-button" onClick={() => handleLike(post._id)}>Like ({post.likes})</button>

              {/* Comment Section */}
              <div className="comment-section">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button className="comment-button" onClick={() => handleComment(post._id)}>Comment</button>
              </div>

              {/* Display Comments */}
              <div className="comments">
                {post.comments && post.comments.map((comment: string, index: number) => (
                  <p key={index} className="comment">{comment}</p>
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
