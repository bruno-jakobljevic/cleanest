import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import Login from './components/Login';
import Register from './components/Register';
import ImageAndMapUpload from './components/ImageAndMapUpload';
import Tasks from './components/Tasks';
import Reports from './components/Reports';
import Users from './components/Users';
import Events from './components/Events';
import ReportsManager from './components/ReportsManager';

const initialUser = {
  email: '',
  username: '',
  password: '',
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [decoded, setDecoded] = useState(null);
  const [events, setEvents] = useState([]);
  const [reports, setReports] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(initialUser);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState(4);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
      fetchEvents();
      fetchReports();
      fetchTasks();
      fetchUsers();
    }
  }, [token]);

  const fetchEvents = () => {
    axios
      .get('http://localhost:3001/events')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error getting the events:', error));
  };

  const fetchReports = () => {
    axios
      .get('http://localhost:3001/reports')
      .then((response) => setReports(response.data))
      .catch((error) => console.error('Error fetching reports:', error));
  };

  const fetchTasks = () => {
    axios
      .get('http://localhost:3001/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };

  const fetchUsers = () => {
    axios
      .get('http://localhost:3001/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  };

  const handleStatusChange = (reportId, statusId) => {
    axios
      .put(`http://localhost:3001/reports/${reportId}/status`, {
        status_id: statusId,
      })
      .then(() => {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status_id: statusId } : report
          )
        );
      })
      .catch((error) => console.error('Error updating status:', error));
  };

  const handleCheckChange = (reportId, isChecked) => {
    axios
      .put(`http://localhost:3001/reports/${reportId}/check`, {
        is_checked: isChecked,
      })
      .then(() => {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId
              ? { ...report, is_checked: isChecked }
              : report
          )
        );
      })
      .catch((error) => console.error('Error updating check status:', error));
  };

  const handleDelete = (reportId) => {
    axios
      .delete(`http://localhost:3001/reports/${reportId}`)
      .then(() => {
        setReports((prevReports) =>
          prevReports.filter((report) => report.id !== reportId)
        );
      })
      .catch((error) => console.error('Error deleting report:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setDecoded(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/login', user)
      .then((res) => {
        setResponse(res);
        localStorage.setItem('token', res.data.token);
        const token = localStorage.getItem('token');
        setToken(token);
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      })
      .catch((error) => console.error(error));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/register', user)
      .then((res) => {
        setResponse(res);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      await axios.post('http://localhost:3001/tasks', taskData);
      fetchTasks(); // Refresh tasks after adding a new one
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleRoleChange = (userId, newRoleId) => {
    axios
      .put(`http://localhost:3001/users/${userId}/role`, { role_id: newRoleId })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role_id: newRoleId } : user
          )
        );
      })
      .catch((error) => console.error('Error updating user role:', error));
  };

  const filteredReports = reports.filter(
    (report) => status === 4 || report.status_id === status
  );

  return (
    <>
      <div>
        {token && <button onClick={handleLogout}>Logout</button>}
        {token && (
          <Events
            events={events}
            roleId={decoded.role_id}
            onApply={applyToEvent}
            onSubmit={handleEventSubmit}
          />
        )}
        {!token && (
          <Reports
            reports={filteredReports}
            status={status}
            setStatus={setStatus}
          />
        )}
      </div>

      <div>
        {!token && (
          <Login
            user={user}
            onChange={handleChange}
            onSubmit={handleLogin}
            response={response}
          />
        )}
        {!token && (
          <Register
            user={user}
            onChange={handleChange}
            onSubmit={handleRegister}
            response={response}
          />
        )}
        {token && <ImageAndMapUpload />}
        {decoded?.role_id >= 2 && (
          <Tasks tasks={tasks} onTaskSubmit={handleTaskSubmit} />
        )}
        {decoded?.role_id >= 3 && (
          <ReportsManager
            reports={reports}
            roleId={decoded.role_id}
            onStatusChange={handleStatusChange}
            onCheckChange={handleCheckChange}
            onDelete={handleDelete}
          />
        )}
        {decoded?.role_id >= 3 && (
          <Users users={users} onRoleChange={handleRoleChange} />
        )}
      </div>
    </>
  );
}

export default App;