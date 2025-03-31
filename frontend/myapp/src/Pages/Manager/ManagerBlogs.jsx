import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../components/Customer/BlogPage/BlogPage.css";
import "./ManagerBlogs.css";
function ManagerBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);

  // Create/Edit Post States
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

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      // Create a preview URL for the image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clear image preview and file
  const handleRemoveImage = () => {
    setNewPostImage(null);
    setImagePreview(null);
  };

  // 1. Handle Create/Edit Post
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

      // Add the image file if it exists
      if (newPostImage) {
        formData.append("image", newPostImage);
      }

      let response;
      if (editMode && selectedPostId) {
        // Update existing post
        formData.append("id", selectedPostId);
        response = await axios.put(
          `http://localhost:5254/api/Post/${selectedPostId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showToast("Post updated successfully!", "success", "✍️");
      } else {
        // Create new post
        response = await axios.post(
          "http://localhost:5254/api/Post",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        showToast("Post created successfully!", "success", "✍️");
      }

      setShowCreatePostModal(false);
      // Reset form fields
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage(null);
      setImagePreview(null);
      setEditMode(false);
      setSelectedPostId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error with post:", error);
      showToast(
        `Failed to ${editMode ? "update" : "create"} post. Please try again.`,
        "error",
        "❌"
      );
    } finally {
      setUploadingPost(false);
    }
  };

  // 2. Handle Delete Blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5254/api/Post/${blogId}`);
      showToast("Blog post deleted successfully!", "success", "🗑️");
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error("Error deleting blog post:", error);
      showToast("Failed to delete blog post. Please try again.", "error", "❌");
    }
  };

  // 3. Handle Search Posts
  const handleSearchPost = async () => {
    if (!searchTerm.trim()) {
      fetchPosts(); // If search term is empty, fetch all posts
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5254/api/Post/search?searchTerm=${searchTerm}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
      showToast("Failed to search posts. Please try again.", "error", "❌");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit post button click
  const handleEditPost = (post) => {
    setEditMode(true);
    setSelectedPostId(post.id);
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
    setImagePreview(post.image);
    setShowCreatePostModal(true);
  };

  // 4. Handle Update Comment
  const handleUpdateComment = async () => {
    if (!commentText.trim()) {
      showToast("Comment content cannot be empty!", "warning", "⚠️");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5254/api/Comment/UpdateComment/${editCommentId}`,
        {
          postId: selectedPostId,
          content: commentText,
        }
      );
      showToast("Comment updated successfully!", "success", "💬");
      setShowModal(false);
      setCommentText("");
      setEditCommentId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating comment:", error);
      showToast("Error updating comment. Please try again.", "error", "❌");
    }
  };

  // 5. Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5254/api/Comment/Delete/${commentId}`
      );
      showToast("Comment deleted successfully!", "success", "🗑️");
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment. Please try again.", "error", "❌");
    }
  };

  // Handle edit comment button click
  const handleEditComment = (comment) => {
    setEditCommentId(comment.id);
    setCommentText(comment.content);
    setSelectedPostId(comment.postId);
    setShowModal(true);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="manager-blog-container">
      {/* Header Section */}
      <div className="manager-header">
        <h1>Manage Blog Posts</h1>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearchPost} className="search-button">
          Search
        </button>
        <button
          onClick={() => {
            setSearchTerm("");
            fetchPosts();
          }}
          className="reset-button"
        >
          Reset
        </button>
      </div>

      {/* Posts List */}
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No Posts Found.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-author">
                Post by: <span>{post.userName}</span>
              </div>
              <div className="post-title">
                Title: {post.title}
              </div>
              <div className="post-content">
                Content: {post.content}
              </div>
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Post" />
                </div>
              )}
              <div className="post-actions">
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowComments(!showComments);
                  }}
                  className="comments-button"
                >
                  💬 Comments ({post.commentCount})
                </button>
                <button
                  onClick={() => handleDeleteBlog(post.id)}
                  className="delete-button"
                >
                   Delete
                </button>
              </div>

              {/* Comments Section */}
              {showComments && selectedPost?.id === post.id && (
                <div className="comments-section">
                  <h3>Comments</h3>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{comment.userName}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="delete-comment-button"
                        >
                          Delete Comment
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

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

      {/* Create/Edit Post Modal with Scrollable Content */}
      {showCreatePostModal && (
        <div className="modal-overlay">
          <div className="modal-content scrollable-modal">
            <div className="modal-header">
              <h2>{editMode ? "Edit Post" : "Create New Post"}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowCreatePostModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form">
                <label>
                  Title:
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </label>
                <label>
                  Content:
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Enter post content"
                    required
                    rows={8}
                  />
                </label>
                <label>
                  Image:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                {imagePreview && (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
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
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCreatePost}
                className="save-post-btn"
                disabled={uploadingPost}
              >
                {uploadingPost
                  ? "Saving..."
                  : editMode
                  ? "Update Post"
                  : "Create Post"}
              </button>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Comment Modal with Scrollable Content */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content scrollable-modal">
            <div className="modal-header">
              <h2>Edit Comment</h2>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowModal(false);
                  setCommentText("");
                  setEditCommentId(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form">
                <label>
                  Comment:
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Edit your comment"
                    required
                    rows={5}
                  />
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleUpdateComment}
                className="save-comment-btn"
              >
                Update Comment
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setCommentText("");
                  setEditCommentId(null);
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

export default ManagerBlogs;
