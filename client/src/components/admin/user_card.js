import React from 'react';
import {Trash2, Check} from 'lucide-react'
import '../../styles/user_card.css';

const UserCard = ({ user, onApprove, onDelete }) => {
  return (
    <div className="user-card col-span-12 lg:col-span-6 flex flex-col gap-5">
      <div className="user-details w-full">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </thead>

          <tbody>
            <tr className="*:text-center">
              <td className="w-1/4 truncate">{`${user.firstName} ${user.lastName}`}</td>
              <td className="w-1/4 truncate">{user.email}</td>
              <td className="w-1/4 truncate">{user.role}</td>
              <td
                className={`${
                  user.isActive ? 'text-primary' : 'text-red-800'
                } w-1/4 truncate`}
              >
                {user.isActive ? 'Approved' : 'Pending Approval'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-end items-center gap-5">
        {!user.isActive && (
          <button
            className="approve-btn w-40 flex justify-center items-center gap-4"
            onClick={() => onApprove(user.username)}
          >
            <Check /> Approve
          </button>
        )}
        <button
          className="delete-btn w-40 flex justify-center items-center gap-4"
          onClick={() => onDelete(user.username)}
        >
          <Trash2 /> Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
