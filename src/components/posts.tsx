import React, { useState, useEffect } from 'react';
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
    const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
    const navigate = useNavigate();

  // Fetch comment counts for each post
  useEffect(() => {
    setUpdatedPosts(posts);
    const fetchCommentCounts = async () => {
      for (const post of posts) {
        try {
          const commentResponse = await axios.get(`http://localhost:3000/comments/comment/${post._id}`);
          setUpdatedPosts((prevPosts) =>
            prevPosts.map((p) =>
              p._id === post._id
                ? { ...p, commentCount: commentResponse.data.length }
                : p
            )
          );
        } catch (error) {
          console.error(`Error fetching comments for post ${post._id}:`, error);
        }
      }
    };

    fetchCommentCounts();
  }, [posts]); // Runs only when `posts` prop changes

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
          setUpdatedPosts((prevPosts) =>
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
        })
        .catch((error) => {
          console.error('There was an error adding the comment:', error);
        });
    }
  };

  return (
    <div>
      {updatedPosts.map((post) => (
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
