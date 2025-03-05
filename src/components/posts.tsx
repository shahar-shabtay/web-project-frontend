import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import like from './like';

interface Post {
  _id: string;
  title: string;
  content: string;
  owner: string;
  commentCount?: number;
  comments?: { commenter: string; content: string }[];
  likesCount: number;
};


interface PostsProps {
  posts: Post[];
}

const accessToken = Cookies.get("accessToken");
let userName = '';

if (!accessToken) {
  console.log('Access token not found');
} else {
  // Decode the JWT token to extract user ID
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  const userId = payload._id;
  if (!userId) {
    throw new Error('User ID not found in token');
  }
  const response = await axiosInstance.get(`/users/${userId}`);
  userName = response.data.username;
}

const Posts = ({ posts }: PostsProps) => {
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });
  // const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  // const [likesActiveCount, setlikesActiveCount] = useState<number>(likesCount || 0);
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");  

  // Fetch comment counts for each post
  useEffect(() => {
    setUpdatedPosts(posts);
    const fetchCommentCounts = async () => {
      for (const post of posts) {
        try {
          const commentResponse = await axiosInstance.get(`/comments/comment/${post._id}`);
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
  }, [posts]);

    // Fetch likes counts for each post
    useEffect(() => {
      setUpdatedPosts(posts);
      const fetchLikesCounts = async () => {
        for (const post of posts) {
          try {
            const likesResponse = await axiosInstance.get(`/likes/like/${post._id}`);
            const likesCount = likesResponse.data.likesCount;
            
            setUpdatedPosts((prevPosts) =>
              prevPosts.map((p) =>
                p._id === post._id
                  ? { ...p, likesCount: likesCount } // Update only likesCount
                  : p
              )
            );
          } catch (error) {
            console.error(`Error fetching likes for post ${post._id}:`, error);
          }
        }
      };
  
      fetchLikesCounts();
    }, [posts]);

    // Add a comment to a post
  const handleComment = (postId: string) => {
    const commentContent = newComments[postId]?.trim();
    if (commentContent) {
      const commenter = userName;
      axiosInstance
        .post(`/comments`, {
          commenter,
          postID: postId,
          content: commentContent,
        })
        .then((response) => {
          setUpdatedPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: [...(post.comments || []), response.data],
                    commentCount: (post.commentCount || 0) + 1,
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

  // Delete a post
  const handleDelete = async (postId: string) => {
    const confirmDelete = window.confirm('This post will be deleted. Are you sure?');
    if (!confirmDelete) return;
    
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setUpdatedPosts(updatedPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting the post:', error);
    }
  };

  // Edit a post
  const handleEditClick = (post: Post) => {
    setEditingPostId(post._id);
    setEditFormData({ title: post.title, content: post.content });
  };

  // Save the edited post
  const handleSaveEdit = async (postId: string) => {
    try {
      await axiosInstance.put(`/posts/${postId}`, editFormData);
      setUpdatedPosts(updatedPosts.map(post => post._id === postId ? { ...post, ...editFormData } : post));
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating the post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      if (likedPosts[postId]) {
        await like.DeleteLike(postId);
        setLikedPosts({ ...likedPosts, [postId]: false });
        setUpdatedPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likesCount: Math.max(0, post.likesCount - 1) }
              : post
          )
        );
      } else {
        await like.CreateLike(postId);
        setLikedPosts({ ...likedPosts, [postId]: true });
        setUpdatedPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likesCount: post.likesCount + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };


  // Check if the current user is the owner of the post
  const isUserPost = (post: Post) => {
    if (!accessToken) {
      throw new Error('Access token not found');
    }  

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload._id;
    return userId === post.owner;
  };

  return (
    <div>
      {updatedPosts.map((post) => (
        <div key={post._id} className="post border rounded p-3 mb-3">
          {editingPostId === post._id ? (
            <div>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="form-control mb-2"
              />
              <textarea
                value={editFormData.content}
                onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                className="form-control mb-2"
              />
              <button className="btn btn-success me-2" onClick={() => handleSaveEdit(post._id)}>Save</button>
              <button className="btn btn-secondary" onClick={() => setEditingPostId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <h4 className="post-title mb-2">{post.title}</h4>
              <p className="post-content mb-2">{post.content}</p>
              {isUserPost(post) && (
                <div className="user-actions mb-2">
                  <button className="btn btn-primary me-2" onClick={() => handleEditClick(post)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              )}
            </>
          )}
          <div className="post-actions">
            <div className="like-section">
                <button
                  className="like-button btn"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleLike(post._id)}
                >
                  {likedPosts[post._id] ? 'Unlike' : 'Like'}
                  <img
                    src={likedPosts[post._id] ? '/after_like.png' : '/before_like.png'}
                    alt={likedPosts[post._id] ? 'Liked' : 'Like'}
                    style={{ width: '24px', height: '24px' }}
                  />
                </button>
                <span>{post.likesCount} Likes</span>
              </div>
            <div className="comment-section">
              <input
                type="text"
                value={newComments[post._id] || ''}
                onChange={(e) => setNewComments({ ...newComments, [post._id]: e.target.value })}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button className="comment-button" onClick={() => handleComment(post._id)}>Comment</button>
            </div>
            <div className="comments-overview">
              <span>{post.commentCount || 0} comments</span>
              <button 
                className="btn btn-link" 
                onClick={() => {
                  navigate(`/comments/${post._id}/${encodeURIComponent(post.title)}`);
                }}
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