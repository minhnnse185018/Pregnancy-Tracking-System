import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogPage.css";
import CommentModal from "./CommentModal"; // Import the CommentModal component

function CommunityPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5254/api/Post/GetAll"
      );
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `https://67b7d8632bddacfb27101cc1.mockapi.io/api/Blog/comment`,
        {
          postId: selectedPostId, // Associate comment with the correct post
          text: commentText,
        }
      );
      alert("Comment added successfully!");

      // Close the modal and reset input
      setShowModal(false);
      setCommentText("");

      // Refresh the posts to show updated comment counts
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="community-container pregnant-theme">
      <nav className="community-nav">
        <button className="nav-item active">Home</button>
        <button className="nav-item">Bookmarks</button>
        <button className="nav-item">Trending</button>
        <button className="nav-item">My Groups</button>
        <button className="nav-item">Activity</button>
        <button className="nav-item">Discover</button>
      </nav>

      <div className="posts-header">
        <h1 className="posts-title">Posts in my groups</h1>
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <p>Chưa có bài viết nào.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <div className="post-user">
                  <div className="post-info">
                    <p className="post-metadata">
                      Đăng bởi <span className="author-name">{post.userName}</span>
                    </p>
                    <h2 className="post-title">Title: {post.title}</h2>
                  </div>
                </div>
                <p className="post-text">Content: {post.content}</p>
                <div className="post-stats">
                  <span className="post-time">
                    Created At: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="interaction-stats">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedPostId(post.id);
                      }}
                      className="add-comment-btn"
                    >
                      💬 Leave Comment 
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowComments(!showComments);
                      }}
                      className="view-comments-btn"
                    >
                      💬 View Comments ({post.commentCount})
                    </button>
                  </div>
                </div>

                {showComments && selectedPost?.id === post.id && (
                  <div className="comments-section">
                    <h3>Comments</h3>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-header">
                            <span className="comment-author">{comment.userName}</span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <CommentModal
          commentText={commentText}
          setCommentText={setCommentText}
          handleAddComment={handleAddComment}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default CommunityPosts;
