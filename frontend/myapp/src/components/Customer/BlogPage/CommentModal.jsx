import React from "react";
import "./CommentModal.css";

const CommentModal = ({ showModal, setShowModal, commentText, setCommentText, handleAddComment }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Leave a Comment</h2>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment here..."
        />
        <div className="modal-actions">
          <button onClick={handleAddComment} className="submit-comment-btn">Submit</button>
          <button onClick={() => setShowModal(false)} className="cancel-comment-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;