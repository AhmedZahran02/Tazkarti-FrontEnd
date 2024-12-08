import React, { useState, useEffect } from 'react';
import UserCard from './user_card';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

const baseUrl = 'http://not-tazkarti-back-production.up.railway.app'; // Adjust the base URL to your backend

const UsersList = () => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext); // Get user data from context

  const [users, setUsers] = useState([]); // State to store users from backend
  const [filter, setFilter] = useState('all'); // Filter state

  const handleApprove = async (username) => {
    try {
      const token = authData.token; // Get token from context

      // Make the PATCH request to activate the user
      const response = await axios.patch(
        `${baseUrl}/auth/activate/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.username === username ? { ...user, isActive: true } : user
          )
        );
      }
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to approve user.');
    }
  };

  const handleDelete = async (username) => {
    try {
      const token = authData.token; // Get token from context

      // Make the DELETE request to remove the user
      const response = await axios.delete(
        `${baseUrl}/auth/remove/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
        }
      );

      if (response.status === 201) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.username !== username)
        );
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  // Filter users based on the selected filter
  const filteredUsers = users.filter((user) => {
    if (filter === 'approval') return !user.isActive;
    if (filter === 'isActive') return user.isActive;
    return true; // "all"
  });

  useEffect(() => {
    if (authData.user && authData.user.userType === 'admin') {
      // Fetch users from backend if the user is an admin
      const fetchUsers = async () => {
        try {
          const token = authData.token; // Get token from context
          // Make request to the backend to get users
          const response = await axios.get(`${baseUrl}/users/get-all`, {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to the request
            },
          });

          setUsers(response.data.users); // Set the users from the response
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    } else {
      navigate('/'); // Redirect if the user is not an admin
    }
  }, [authData.user, authData.token, navigate]);

  return (
    <div>
      <h2>User Management</h2>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="filter" style={{ marginRight: '10px' }}>
          Filter Users:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="approval">Waiting for Approval</option>
          <option value="isActive">Approved Users</option>
        </select>
      </div>

      {/* User Cards */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserCard
            key={user._id} // Changed to use _id as the unique key
            user={user}
            onApprove={handleApprove}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UsersList;
