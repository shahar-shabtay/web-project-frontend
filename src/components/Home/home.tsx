import React, { useEffect, useState } from 'react';
import './home.css';
import Header from '../header';
import axios from 'axios';
import CreatePostPage from '../../pages/CreatePostPage';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [likedPosts, setLikedPosts] = useState<{ [postId: string]: boolean }>({});
  const navigate = useNavigate();

  // Fetch posts when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3000/posts')
      .then((response) => {
        const fetchedPosts = response.data;
        setPosts(fetchedPosts);

        // Fetch comment counts for each post
        fetchedPosts.forEach((post: any) => {
          axios
            .get(`http://localhost:3000/comments/comment/${post._id}`)
            .then((commentResponse) => {
              // Update the post with its comment count
              setPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p._id === post._id
                    ? { ...p, commentCount: commentResponse.data.length }
                    : p
                )
              );
            })
            .catch((error) => {
              console.error(`Error fetching comments for post HomePage ${post._id}:`, error);
            });
        }
        );
      })
      .catch((error) => {
        console.error('HomePage2 Error fetching the posts:', error);
      });
  }, []);

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
          setPosts((prevPosts) =>
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
          setShowSuccess(true);
        })
        .catch((error) => {
          console.error('There was an error adding the comment:', error);
        });
    }
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts({ ...likedPosts, [postId]: !isLiked });

    // Trigger your API call to update like count
    likePostAPI(postId, !isLiked)
      .then((updatedLikeCount) => {
        console.log('Post liked successfully!');
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, likeCount: updatedLikeCount }
              : post
          )
        );
      })
      .catch((err) => {
        console.error('Error liking post:', err);
        setLikedPosts({ ...likedPosts, [postId]: isLiked }); // Revert on error
      });
  };

  const likePostAPI = async (postId: string, isLiked: boolean) => {
    // Add your API logic for liking a post here
    console.log(`API call to like post with ID: ${postId}, isLiked: ${isLiked}`);

    // Mock API response with updated like count (for example)
    return Promise.resolve(isLiked ? 1 : 0);  // Mocking like count: 1 if liked, 0 if unliked
};

  // const likePostAPI = async (postId: string, liked: boolean) => {
  //   // Add your API logic for liking a post here
  //   console.log(`API call to like post with ID: ${postId}, Liked: ${liked}`);
    
  //   // For example, update the like count in the backend and return the new like count
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:3000/posts/like/${postId}`,
  //       { liked }
  //     );
  //     return response.data.likeCount; // Assuming the API returns the updated like count
  //   } catch (error) {
  //     throw new Error('Error updating like count');
  //   }
  // };
  
  return (
    <div className="d-flex flex-column align-items-center bg-light vh-100 p-4">
      <Header />
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
        <img src="/full_logo.png" alt="Logo" className="full-logo" />
        <CreatePostPage />
        {posts.map((post) => (
          <div key={post._id} className="post border rounded p-3 mb-3">
            <h4 className="post-title mb-2">{post.title}</h4>
            <p className="post-description mb-2">{post.description}</p>
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
                <img
                  src={likedPosts[post._id] ? '/after_like.png' : '/before_like.png'}
                  alt={likedPosts[post._id] ? 'Liked' : 'Like'}
                  style={{ width: '24px', height: '24px' }}
                />
              </button>
              <span>{likedPosts[post._id] ? 1 : 0} Likes</span>
                {/* <span>{post.likeCount || 0} Likes</span> */}
              </div>
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
    </div>
  );
};

export default Home;
