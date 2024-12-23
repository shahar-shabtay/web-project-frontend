import React from 'react';
import './home.css';
import Header from '../header';
// import Footer from './footer';

const Home: React.FC = () => {
  return (
    <div className="d-flex flex-column alsign-items-center bg-light vh-100 p-4">
      <Header/>
      <div className="card-container">
        <h2 className="text-center mb-4">Share, Like, and Comment on Posts</h2>
        <button className="add-post-btn">Add New Post</button>
        {/* Placeholder for posts */}
        <div className="post border rounded p-3 mb-3">
          <h4 className="post-title mb-2">Meet Bella</h4>
          <p className="post-description mb-2">
            Bella is a 2-year-old Labrador looking for a loving home!
          </p>
          <div className="post-actions">
            <button className="like-button">Like</button>
            <button className="comment-button">Comment</button>
            <button className="share-button">Share</button>
          </div>
        </div>
        <div className="post border rounded p-3 mb-3">
          <h4 className="post-title mb-2">Adopt Max!</h4>
          <p className="post-description mb-2">
            Max is a playful Golden Retriever who loves cuddles.
          </p>
          <div className="post-actions">
            <button className="like-button">Like</button>
            <button className="comment-button">Comment</button>
            <button className="share-button">Share</button>
          </div>
        </div>
        {/* Add more posts here */}
      </div>
    </div>
  );
};

export default Home;