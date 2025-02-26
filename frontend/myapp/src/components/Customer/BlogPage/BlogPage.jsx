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

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "https://67b7d8632bddacfb27101cc1.mockapi.io/api/Blog/content"
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
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-content">
                <div className="post-user">
                  <img
                    src={post.avatar || "/images/default-avatar.jpg"}
                    alt={post.author}
                    className="user-avatar"
                  />
                  <div className="post-info">
                    <p className="post-metadata">
                      By <span className="author-name">{post.author}</span> in{" "}
                      <span className="group-name">{post.category}</span>
                    </p>
                    <h2 className="post-title">{post.question}</h2>
                  </div>
                </div>
                <p className="post-text">{post.answer}</p>
                <div className="post-stats">
                  <span className="post-time">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                  <div className="interaction-stats">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedPostId(post.id);
                      }}
                      className="add-comment-btn"
                    >
                      💬 Comment
                    </button>
                  </div>
                </div>
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
