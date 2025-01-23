import React, { useState } from "react";
import Cookies from "js-cookie";
import "../styles/CreatePostPage.css";
import axiosInstance from '../api/axiosInstance';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [owner] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const postData = { title, content, owner };
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const response = await axiosInstance.post('/posts', postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response:", response); 
      if (response.status === 201) {
        console.log('Post created:', response.data);
        // Refresh the page to reflect the new post
        window.location.reload();  // This will reload the entire page
      }

      else {
        throw new Error(`Failed to create post: ${response}`);
      }

      console.log("Post created successfully:", response);

      // Clear form fields after successful submission
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("Error creating post:", error);
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <label>
        Title:
        <input className="post-box"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Content:
        <textarea className="post-box"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>
      <button className="create-post-btn" type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostPage;
