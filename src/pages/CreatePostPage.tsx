import React, { useState } from "react";
import Cookies from "js-cookie";
import "./createPostPage.css";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [owner] = useState("64fe4c2ae7891b6cf7890def");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const postData = { title, content, owner };
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok){
        const data = await response.json();
        console.log('Post created:', data);
        // Refresh the page to reflect the new post
        window.location.reload();  // This will reload the entire page
      }

      else {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Post created successfully:", result);

      // Clear form fields after successful submission
      setTitle("");
      setContent("");
    } catch (error) {
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
