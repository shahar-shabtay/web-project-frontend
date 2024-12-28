import React, { useState } from 'react';
import './createPostPage.css'; // Import your CSS

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [owner] = useState('64fe4c2ae7891b6cf7890def'); // Example of hardcoded owner ID, replace as necessary

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const postData = {
      title,
      content,
      owner
    };

    try {
      // Send a POST request to the backend API
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created successfully:', data);
        // Optionally reset form fields
        setTitle('');
        setContent('');
      } else {
        console.error('Failed to create post:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="form-title">Create a New Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter post content"
            required
          />
        </div>

        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;
