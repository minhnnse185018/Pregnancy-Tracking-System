import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./BlogDetailsPage.css";
import CommentModal from "./CommentModal";

function BlogDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(true);

  // Toast state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  // Show toast notification function
  const showToast = (message, type = "success", icon = "✅") => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      icon,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const fetchPostDetails = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("User not logged in. Please log in first.", "error", "❌");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5254/api/Post/GetPostById/${id}`
      );
      setPost(response.data);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError("Failed to load post details.");
      showToast("Failed to load post details.", "error", "❌");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("You are not logged in. Please log in first!", "warning", "⚠️");
      navigate("/login");
      return;
    }
    if (!commentText.trim()) {
      showToast("Comment content cannot be empty!", "warning", "⚠️");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5254/api/Comment", {
        userId,
        postId: id,
        content: commentText,
      });
      showToast("Comment added successfully!", "success", "💬");
      setShowModal(false);
      setCommentText("");
      fetchPostDetails(); // Refresh post to show new comment
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Error adding comment. Please try again.", "error", "❌");
    }
  };

  const handleGoBack = () => {
    navigate("/blog");
  };

  if (loading)
    return (
      <div className="community-container pregnant-theme">
        <div className="loading-spinner">Loading post details...</div>
      </div>
    );

  if (error)
    return (
      <div className="community-container pregnant-theme">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleGoBack} className="back-button">
            Back to Posts
          </button>
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="community-container pregnant-theme">
        <div className="error-message">
          <p>Post not found</p>
          <button onClick={handleGoBack} className="back-button">
            Back to Posts
          </button>
        </div>
      </div>
    );

  return (
    <div className="community-container pregnant-theme">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`custom-toast ${toast.type}`}>
            <div className="toast-header">
              <span className="toast-icon">{toast.icon}</span>
              <span className="toast-title">Notification</span>
              <button
                className="toast-close"
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
              >
                ×
              </button>
            </div>
            <div className="toast-body">{toast.message}</div>
          </div>
        ))}
      </div>
      <div className="blog-header-container">
        <div className="back-button-container">
          <button onClick={handleGoBack} className="back-button">
            ← Back to Posts
          </button>
        </div>
        <div className="title-container">
          <h1 className="posts-title">Post Details</h1>
        </div>
      </div>

      <div className="post-detail-container">
        <div className="post-card detail-view">
          <div className="post-content">
            <div className="post-user">
              <div className="post-info">
                <p className="post-metadata">
                  Post by: <span className="author-name">{post.userName}</span>
                </p>
                <h2 className="post-title">{post.title}</h2>
              </div>
            </div>
            <p className="post-text">{post.content}</p>

            {/* Display post image if available */}
            {post.image && (
              <div className="post-image-container">
                <img src={post.image} alt="Post" className="post-image" />
              </div>
            )}

            <div className="post-stats">
              <span className="post-time">
                Created At: {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="comments-section">
              <div className="comments-header">
                <h3>Comments ({post.comments?.length || 0})</h3>
                <button
                  onClick={() => setShowModal(true)}
                  className="add-comment-btn"
                >
                  💬 Leave Comment
                </button>
              </div>

              {showComments && post.comments && post.comments.length > 0 ? (
                <div className="comments-list">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.userName}
                        </span>
                        <span className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-comments">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        showModal={showModal}
        setShowModal={setShowModal}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
      />
    </div>
  );
}

export default BlogDetailsPage;
