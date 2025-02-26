import React from "react";
import "./CommentModal.css";

function CommentModal({ commentText, setCommentText, handleAddComment, setShowModal }) {
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
          <button onClick={handleAddComment}>Submit</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
