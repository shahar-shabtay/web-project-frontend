import React from "react";

interface Post {
  _id: string;
  title: string;
  content: string;
  owner: string;
  comments?: { commenter: string; content: string }[];
  commentCount?: number;
  likesCount: number;
  isLiked: boolean;
  imageUrl?: string;
}

interface PostsProps {
  posts: Post[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Posts: React.FC<PostsProps> = ({ posts, currentPage, setCurrentPage, totalPages }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="card-container">
          <h4 className="post-title">{post.title}</h4>
          <p className="post-content">{post.content}</p>
        </div>
      ))}

      {/* Paging Controls */}
      <div className="paging-controls">
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

export default Posts;