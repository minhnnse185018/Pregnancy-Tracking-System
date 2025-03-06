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

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);
  //handle post
  const fetchPosts = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5254/api/Post/GetAll");
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };
  //handleComment function
  const handleAddComment = async () => {
    console.log("Selected Post ID:", selectedPostId);
    console.log("Comment content:", commentText);

    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("You are not logged in. Please log in first!");
      return;
    }
    if (!commentText.trim()) {
      alert("Comment content cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5254/api/Comment", {
        postId: selectedPostId,
        userId,
        content: commentText,
      });
      console.log("Server response:", response);
      alert("Comment added successfully!");
      setShowModal(false);
      setCommentText("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

                                  //function create post
  const handleCreatePost = async () => {
    const userId = sessionStorage.getItem("userID");
    if (!userId) {
      alert("You are not logged in. Please log in first!");
      return;
    }
    if (!newPostTitle.trim()) {
      alert("Post title cannot be empty!");
      return;
    }
    if (!newPostContent.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5254/api/Post", {
        title: newPostTitle,
        content: newPostContent,
        userId,
      });
      console.log("Server response:", response);
      alert("Post created successfully!");
      setShowCreatePostModal(false);
      setNewPostTitle("");
      setNewPostContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="community-container pregnant-theme">
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
      {/* Create Post Modal */}
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
            />
            <div className="modal-actions">
              <button onClick={handleCreatePost}>Create Post</button>
              <button onClick={() => setShowCreatePostModal(false)}>
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
