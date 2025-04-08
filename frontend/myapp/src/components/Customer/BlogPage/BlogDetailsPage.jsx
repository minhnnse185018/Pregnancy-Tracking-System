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

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Check if it's the default date (0001-01-01)
    if (date.getFullYear() === 1 || isNaN(date.getTime())) {
      return "";
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
      
      // Sort comments newest first if they exist
      if (response.data.comments && response.data.comments.length > 0) {
        response.data.comments.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      
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
      
      // Refresh the page to get the latest data including the new comment
      window.location.reload();
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

      <div className="posts-header">
        <button onClick={handleGoBack} className="back-button" style={{textAlign: "center"}}>
          ← Back to Posts
        </button>
        <h1 className="posts-title">Post Details</h1>
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
                Created: {formatDate(post.createdAt)}
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
                          {formatDate(comment.createdAt)}
                          {comment.updatedAt && comment.updatedAt !== "0001-01-01T00:00:00" && (
                            <span className="edited-indicator"> (edited {formatDate(comment.updatedAt)})</span>
                          )}
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