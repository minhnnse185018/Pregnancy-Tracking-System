import axios from "axios";
import React, { useEffect, useState } from "react";
import "./BlogPage.css";
import CommentModal from "./CommentModal";

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

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (message, type = "success", icon = "✅") => {
    const id = Date.now();
    const newToast = { id, message, type, icon };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(
      () => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
      3000
    );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("You are not logged in. Please log in first!", "warning", "⚠️");
      return;
    }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      showToast("Post title and content cannot be empty!", "warning", "⚠️");
      return;
    }

    try {
      setUploadingPost(true);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", newPostTitle);
      formData.append("content", newPostContent);
      if (newPostImage) formData.append("image", newPostImage);

      await axios.post("http://localhost:5254/api/Post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Post created successfully!", "success", "✍️");
      setShowCreatePostModal(false);
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

  const handleDeletePost = async (postId) => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      showToast("You are not logged in. Please log in first!", "warning", "⚠️");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5254/api/Post/${postId}`, {
          headers: { "Content-Type": "application/json" },
        });
        showToast("Post deleted successfully!", "success", "🗑️");
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        showToast("Failed to delete post. Please try again.", "error", "❌");
      }
    }
  };

  const handleRemoveImage = () => {
    setNewPostImage(null);
    setImagePreview(null);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="community-container pregnant-theme">
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
        <h1 className="posts-title">Posts in my group</h1>
      </div>
      <button
        onClick={() => setShowCreatePostModal(true)}
        className="create-post-btn"
      >
        ✍️ Create New Post
      </button>
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No Posts Yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <div className="post-user">
                  <div className="post-info">
                    <p className="post-metadata">
                      Post by:{" "}
                      <span className="author-name">{post.userName}</span>
                    </p>
                    <h2 className="post-title">Title: {post.title}</h2>
                  </div>
                </div>
                <p className="post-text">Content: {post.content}</p>
                {post.image && (
                  <div className="post-image-container">
                    <img src={post.image} alt="Post" className="post-image" />
                  </div>
                )}
                <div className="post-stats">
                  <span className="post-time">
                    Created At: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="interaction-stats">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setShowComments(!showComments);
                      }}
                      className="view-comments-btn"
                    >
                      💬 View Comments ({post.commentCount})
                    </button>
                    {String(post.userId) ===
                      String(sessionStorage.getItem("userID")) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-post-btn"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
                {showComments && selectedPost?.id === post.id && (
                  <div className="comments-section">
                    <h3>Comments</h3>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
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
                      ))
                    ) : (
                      <p>No comments yet</p>
                    )}
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedPostId(post.id);
                      }}
                      className="add-comment-btn"
                    >
                      💬 Leave Comment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CommentModal
        showModal={showModal}
        setShowModal={setShowModal}
        commentText={commentText}
        setCommentText={setCommentText}
        handleAddComment={handleAddComment}
      />

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
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
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
