import React from 'react';
import './Home/home.css';

interface PostsProps {
  posts: { _id: string; title: string; content: string; commentCount?: number }[];
  newComments: { [key: string]: string };
  setNewComments: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  handleComment: (postId: string) => void;
  navigate: (path: string) => void;
}

const Posts: React.FC<PostsProps> = ({ posts, newComments, setNewComments, handleComment, navigate }) => {
  return (
    <div>
      {posts.map((post) => (
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
