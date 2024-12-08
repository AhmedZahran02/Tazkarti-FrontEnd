import React from 'react';
import '../../styles/user_card.css';

const UserCard = ({ user, onApprove, onDelete }) => {
  return (
    <div className="user-card">
      <div className="user-details">
        <h3>{user.username}</h3>
        <p>
          Name: {user.firstName} {user.lastName}
        </p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Status: {user.isActive ? 'Approved' : 'Pending Approval'}</p>
      </div>
      <div className="user-actions">
        {!user.isActive && (
          <button
            className="approve-btn"
            onClick={() => onApprove(user.username)}
          >
            Approve
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(user.username)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
