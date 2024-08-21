import React from 'react';

const Users = ({ users, onRoleChange }) => {
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email}, {user.role_id})
            <div>
              <label>Role: </label>
              <select
                value={user.role_id}
                onChange={(e) =>
                  onRoleChange(user.id, parseInt(e.target.value))
                }
              >
                <option value='1'>User</option>
                <option value='2'>Employee</option>
                <option value='3'>Manager</option>
                <option value='4'>Admin</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
