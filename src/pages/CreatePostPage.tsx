import React, { useState } from "react";
import Cookies from "js-cookie";
import "../styles/CreatePostPage.css";
import axiosInstance from "../api/axiosInstance";

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [owner] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axiosInstance.post("/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.error("No access token found. Please log in.");
      return;
    }

    const imageUrl = await uploadImage();
    console.log("Image URL:", imageUrl);
    const postData = { title, content, owner, imageUrl };

    try {
      const response = await axiosInstance.post("/posts", postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        console.log("Post created:", response.data);
        window.location.reload();
      } else {
        throw new Error(`Failed to create post: ${response}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label className="upload-label">Upload Image:</label>
        <div className="file-input-container">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </div>
      <div className="form-row">
        <label>Title:</label>
        <input className="post-box" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>Content:</label>
        <textarea className="post-box" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <button className="create-post-btn" type="submit">Create Post</button>
    </form>
  );
};

export default CreatePostPage;