import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UsersAdmin = ({
  users,
  setUsers,
  employees,
  setEmployees,
  managers,
  setManagers,
}) => {
  const [editUserId, setEditUserId] = useState(null);
  const [newRoleId, setNewRoleId] = useState(null);

  const handleEditClick = (userId, currentRoleId) => {
    setEditUserId(userId);
    setNewRoleId(currentRoleId);
  };

  const handleCancelClick = () => {
    setEditUserId(null);
    setNewRoleId(null);
  };

  const handleApplyClick = async (userId) => {
    try {
      if (newRoleId == null) {
        throw new Error('Role ID is not defined');
      }

      await axios.put(`http://localhost:3001/users/adminEditUser/${userId}`, {
        role_id: newRoleId,
      });

      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role_id: newRoleId } : user
      );
      const updatedEmployees = employees.map((employee) =>
        employee.id === userId ? { ...employee, role_id: newRoleId } : employee
      );
      const updatedManagers = managers.map((manager) =>
        manager.id === userId ? { ...manager, role_id: newRoleId } : manager
      );

      const allUpdatedUsers = [
        ...updatedUsers,
        ...updatedEmployees,
        ...updatedManagers,
      ];
      setUsers(allUpdatedUsers.filter((user) => user.role_id === 1));
      setEmployees(allUpdatedUsers.filter((user) => user.role_id === 2));
      setManagers(allUpdatedUsers.filter((user) => user.role_id === 3));

      setEditUserId(null);
      setNewRoleId(null);

      await Swal.fire({
        text: 'User updated!',
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire({
        text: 'Error updating user role.',
        showConfirmButton: false,
        timer: 1500,
        icon: 'error',
      });
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`http://localhost:3001/users/deleteUser/${userId}`);

      const updatedUsers = users.filter((user) => user.id !== userId);
      const updatedEmployees = employees.filter(
        (employee) => employee.id !== userId
      );
      const updatedManagers = managers.filter(
        (manager) => manager.id !== userId
      );
      setUsers(updatedUsers);
      setEmployees(updatedEmployees);
      setManagers(updatedManagers);
      Swal.fire({
        text: 'User deleted!',
        showConfirmButton: false,
        timer: 1500,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const renderTable = (data, title) => (
    <div>
      <h1 className='table-header'>{title}</h1>
      <div style={{ overflow: 'auto' }}>
        <table className='users'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Last Login</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.last_login}</td>
                <td>
                  {editUserId === user.id ? (
                    <p className='custom-select'>
                      <select
                        value={newRoleId}
                        onChange={(e) => setNewRoleId(Number(e.target.value))}
                      >
                        <option value={1}>User</option>
                        <option value={2}>Employee</option>
                        <option value={3}>Manager</option>
                      </select>
                    </p>
                  ) : user.role_id === 1 ? (
                    'User'
                  ) : user.role_id === 2 ? (
                    'Employee'
                  ) : (
                    'Manager'
                  )}
                </td>
                <td>
                  {editUserId === user.id ? (
                    <>
                      <button
                        className='user-button'
                        onClick={() => handleApplyClick(user.id)}
                      >
                        Apply
                      </button>
                      <button
                        className='user-button'
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='user-button'
                        onClick={() => handleEditClick(user.id, user.role_id)}
                      >
                        Edit
                      </button>
                      <button
                        className='user-button'
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      {renderTable(users, 'Users')}
      {renderTable(employees, 'Employees')}
      {renderTable(managers, 'Managers')}
    </div>
  );
};

export default UsersAdmin;
