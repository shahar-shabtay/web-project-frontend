import { useState, useEffect } from 'react';
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
  isLiked: boolean;
  imageUrl?: string;
};


interface PostsProps {
  posts: Post[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
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

const PagedPosts: React.FC<PostsProps> = ({ posts, currentPage, setCurrentPage, totalPages }) => {
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '' });
  const [likedPosts, setLikedPosts] = useState<string[]>([]); // Define state for liked posts
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

  useEffect(() => {
    if (!posts.length) return;
  
    setUpdatedPosts(posts); // Initialize state with posts
  
    const fetchLikeStatus = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.log("Access token not found");
        return;
      }
  
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userId = payload._id;
      if (!userId) {
        console.error("User ID not found in token");
        return;
      }
  
      const likedPostIds: string[] = [];
      const updatedPostData: Post[] = await Promise.all(
        posts.map(async (post): Promise<Post> => {
          try {
            const { request: likedRequest } = like.getLikeByOwner(post._id, userId);
            const likedResponse = await likedRequest;
  
            if (likedResponse.data.liked) {
              likedPostIds.push(post._id);
            }
  
            return { 
              ...post, 
              isLiked: likedResponse.data.liked, 
            };
          } catch (error) {
            console.error("Error fetching like status:", error);
            return { ...post, isLiked: false, likesCount: 0 }; // Ensure type safety
          }
        })
      );
  
      setUpdatedPosts(updatedPostData);
      setLikedPosts(likedPostIds);
    };
  
    fetchLikeStatus();
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
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.log("Access token not found");
      return;
    }
  
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const userId = payload._id;
  
    if (!userId) {
      console.error("User ID not found in token");
      return;
    }
  
    try {
      if (likedPosts.includes(postId)) {
        await like.DeleteLike(postId);
        setLikedPosts((prev) => prev.filter((id) => id !== postId)); // Remove from likedPosts
        setUpdatedPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likesCount: Math.max(0, (post.likesCount || 0) - 1) }
              : post
          )
        );
      } else {
        await like.CreateLike(postId);
  
        setLikedPosts((prev) => [...prev, postId]); // Add to likedPosts
  
        setUpdatedPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likesCount: (post.likesCount || 0) + 1 }
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
        <div key={post._id} className="card-container">
          {editingPostId === post._id ? (
            <div>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                className="form-control mb-2"
              />
              <textarea
                value={editFormData.content}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, content: e.target.value })
                }
                className="form-control mb-2"
              />
              <button
                className="btn btn-success me-2"
                onClick={() => handleSaveEdit(post._id)}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingPostId(null)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
            
              {post.imageUrl && (
                <img
                  src={post.imageUrl} // Assuming post.imageUrl contains the full URL
                  alt="Post Image"
                  className="post-image"
                />
              )}
              <h4 className="post-title">{post.title}</h4>
              <p className="post-content">{post.content}</p>
              {isUserPost(post) && (
                <div className="user-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleEditClick(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
          <div className="post-actions">
            <div className="like-section">
              <button
                className="like-button btn"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                onClick={() => handleLike(post._id)}
              >
                <img
                  src={
                    likedPosts.includes(post._id)
                      ? "/after_like.png"
                      : "/before_like.png"
                  }
                  style={{ width: "24px", height: "24px" }}
                  alt="like button"
                />
              </button>
              <span>{post.likesCount || 0} Likes</span>
            </div>
            <div className="comment-section">
              <input
                type="text"
                value={newComments[post._id] || ""}
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
                onClick={() => {
                  navigate(
                    `/comments/${post._id}/${encodeURIComponent(post.title)}`
                  );
                }}
              >
                View Comments
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Paging */}
      <div className="paging-controls d-flex justify-content-center align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-3">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PagedPosts;