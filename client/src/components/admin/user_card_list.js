import React, { useState, useEffect } from 'react';
import UserCard from './user_card';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth_provider';
import { useContext } from 'react';
import axios from 'axios'; 

const UsersList = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext); 

  const [users, setUsers] = useState([]); 
  const [filter, setFilter] = useState('all'); 

  const handleApprove = async (username) => {
    try {
      const token = authData.token;

      const response = await axios.patch(
        `${baseUrl}/auth/activate/${username}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
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
      const token = authData.token; 

      const response = await axios.delete(
        `${baseUrl}/auth/remove/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
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

  const filteredUsers = users.filter((user) => {
    if (filter === 'approval') return !user.isActive;
    if (filter === 'isActive') return user.isActive;
    return true; 
  });

  useEffect(() => {
    if (authData.user && authData.user.userType === 'admin') {
      const fetchUsers = async () => {
        try {
          const token = authData.token; 
          const response = await axios.get(`${baseUrl}/users/get-all`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });

          setUsers(response.data.users); 
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    } else {
      navigate('/'); 
    }
  }, [authData.user, authData.token, navigate]);

  return (
    <div className=''>
      <h2 className='text-3xl text-primary'>User Management</h2>

      {/* Filter Dropdown */}
      <div className='m-10 mt-2'>
        <label htmlFor="filter" 
        className='text-xl text-primary'
        style={{ marginRight: '10px' }}>
          Filter Users:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='p-4'
        >
          <option value="all">All Users</option>
          <option value="approval">Waiting for Approval</option>
          <option value="isActive">Approved Users</option>
        </select>
      </div>

      <div className='grid grid-cols-12 gap-5 m-10'>
        {/* User Cards */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user._id} 
              user={user}
              onApprove={handleApprove}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className='col-span-12'>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersList;
