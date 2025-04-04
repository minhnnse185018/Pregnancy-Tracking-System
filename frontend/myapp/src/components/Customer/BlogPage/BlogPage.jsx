import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogPage.css";
import CommentModal from "./CommentModal";
import { Link } from "react-router-dom";
function CommunityPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingPost, setUploadingPost] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const fetchPosts = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("User not logged in. Please log in first.", "error", "❌");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5254/api/Post/GetAll");
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load posts.");
      showToast("Failed to load posts.", "error", "❌");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("You are not logged in. Please log in first!", "warning", "⚠️");
      return;
    }
    if (!commentText.trim()) {
      showToast("Comment content cannot be empty!", "warning", "⚠️");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5254/api/Comment", {
        userId,
        postId: selectedPostId,
        content: commentText,
      });
      showToast("Comment added successfully!", "success", "💬");
      setShowModal(false);
      setCommentText("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Error adding comment. Please try again.", "error", "❌");
    }
  };

  // Image handling functions - simplified like in code 1
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      // Create a preview URL for the image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("You are not logged in. Please log in first!", "warning", "⚠️");
      return;
    }
    if (!newPostTitle.trim()) {
      showToast("Post title cannot be empty!", "warning", "⚠️");
      return;
    }
    if (!newPostContent.trim()) {
      showToast("Post content cannot be empty!", "warning", "⚠️");
      return;
    }

    try {
      setUploadingPost(true);

      // Create FormData object to send the file and other post data
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", newPostTitle);
      formData.append("content", newPostContent);

      // Add the image file if it exists - simplified approach like in code 1
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      // Send the formData to your backend API
      const response = await axios.post(
        "http://localhost:5254/api/Post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showToast("Post created successfully!", "success", "✍️");
      setShowCreatePostModal(false);
      // Reset form fields
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Failed to create post. Please try again.", "error", "❌");
    } finally {
      setUploadingPost(false);
    }
  };

  // Clear image preview and file
  const handleRemoveImage = () => {
    setNewPostImage(null);
    setImagePreview(null);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Community Blog</h1>
        <button
          className="create-post-btn"
          onClick={() => setShowCreatePostModal(true)}
        >
          <i className="fas fa-plus"></i> Create Post
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="blog-posts-grid">
          {posts.length === 0 ? (
            <div className="no-posts-message">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div className="blog-card" key={post.id}>
                {post.image ? (
                  <Link to={`/blog/${post.id}`} className="blog-card-image">
                    <img src={post.image} alt={post.title} />
                  </Link>
                ) : (
                  <Link
                    to={`/blog/${post.id}`}
                    className="blog-card-placeholder"
                  >
                    <i className="far fa-image"></i>
                  </Link>
                )}
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-author">
                      <i className="far fa-user"></i> {post.userName || "Admin"}
                    </span>
                    <span className="blog-date">
                      <i className="far fa-calendar-alt"></i>{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="blog-card-title">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="blog-card-excerpt">
                    {post.content.length > 120
                      ? post.content.substring(0, 120) + "..."
                      : post.content}
                  </p>
                  <Link to={`/blog/${post.id}`} className="read-more-link">
                    readMore <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <CommentModal
        showModal={showModal}
        setShowModal={setShowModal}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
      />

      {/* Create Post Modal - Simplified like in code 1 */}
      {showCreatePostModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Post</h2>
            <input
              type="text"
              placeholder="Post Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="post-title-input"
            />
            <textarea
              placeholder="Write your post content here..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="post-textarea"
            />

            {/* Image upload section - simplified like in code 1 */}
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />

              {/* Image preview */}
              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                    style={{ width: "300px" }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="remove-image-btn"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                onClick={handleCreatePost}
                disabled={uploadingPost}
                className="create-btn"
              >
                {uploadingPost ? "Creating..." : "Create Post"}
              </button>
              <button
                onClick={() => {
                  setShowCreatePostModal(false);
                  setNewPostTitle("");
                  setNewPostContent("");
                  setNewPostImage(null);
                  setImagePreview(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPosts;