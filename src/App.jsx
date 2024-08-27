import { useState, useEffect } from 'react';

import Login from './components/Login';
import Register from './components/Register';
import ImageAndMapUpload from './components/ImageAndMapUpload';
import Reports from './components/Reports';
import ReportsEmployee from './components/ReportsEmployee';
import Events from './components/Events';
import AddEvent from './components/AddEvent';
import Users from './components/Users';
import UsersAdmin from './components/UsersAdmin';
import ReportsManager from './components/ReportsManager';

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './App.css';
import icon from './assets/icon.png';
import Swal from 'sweetalert2';

const App = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  const [registrationUser, setRegistrationUser] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [decoded, setDecoded] = useState(token ? jwtDecode(token) : null);
  const [reports, setReports] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState(4);

  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const [response, setResponse] = useState('');
  const [activeComponent, setActiveComponent] = useState('reports');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    }
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3001/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/userEventApplications/applications'
        );
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error getting the events:', error);
      }
    };
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/reports/reportStatuses'
        );
        setStatuses(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/users/employees'
        );
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    const fetchManagers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/users/managers'
        );
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    };
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/users/allUsers'
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    fetchEvents();
    fetchReports();
    fetchApplications();
    fetchStatuses();
    fetchEmployees();
    fetchUsers();
    fetchManagers();
    fetchAllUsers();
  }, [token]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/auth/login', user)
      .then((res) => {
        setResponse(res);
        localStorage.setItem('token', res.data.token);
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        setToken(token);
        setDecoded(decoded);
        setUser({ username: '', password: '' });
        setActiveComponent('reports');
        Swal.fire({
          text: 'Logged in',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'Error',
          text: 'Error logging in',
          showConfirmButton: false,
          timer: 1500,
        });
        console.error(error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setDecoded(null);
    setActiveComponent('reports');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registrationUser.password !== registrationUser.confirmPassword) {
      Swal.fire({
        text: 'Passwords do not match',
        showConfirmButton: false,
        timer: 1500,
        icon: 'error',
      });
      return;
    }
    axios
      .post('http://localhost:3001/auth/register', registrationUser)
      .then((res) => {
        Swal.fire({
          text: 'Registered successfully',
          showConfirmButton: false,
          timer: 1500,
          icon: 'success',
        });
        setRegistrationUser({
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        });
        setActiveComponent('');
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          Swal.fire({
            text: error.response.data.message,
            showConfirmButton: false,
            timer: 1500,
            icon: 'error',
          });
        } else {
          Swal.fire({
            text: 'An error occurred',
            showConfirmButton: false,
            timer: 1500,
            icon: 'error',
          });
        }
      });
  };

  return (
    <>
      <header className='header'>
        <div className='header-content'>
          <h1
            className='app-title'
            onClick={() => setActiveComponent('reports')}
          >
            CleaneST
          </h1>
          <img
            src={icon}
            alt='App Icon'
            className='app-icon'
            onClick={() => setActiveComponent('reports')}
          />
        </div>
      </header>
      <main className='main'>
        <nav className='vertical-nav'>
          <button
            className='nav-button'
            onClick={() => setActiveComponent('reports')}
          >
            Home
          </button>
          {!token && (
            <>
              <button
                className='nav-button'
                onClick={() => setActiveComponent('login')}
              >
                Login
              </button>
              <button
                className='nav-button'
                onClick={() => setActiveComponent('register')}
              >
                Register
              </button>
            </>
          )}

          {token && (
            <>
              <button
                className='nav-button'
                onClick={() => setActiveComponent('events')}
              >
                Events
              </button>
              <button
                className='nav-button'
                onClick={() => setActiveComponent('imageandmapupload')}
              >
                Make a report
              </button>
              {decoded.role_id >= 3 && (
                <>
                  <button
                    className='nav-button'
                    onClick={() => setActiveComponent('addEvent')}
                  >
                    Add event
                  </button>
                  <button
                    className='nav-button'
                    onClick={() => setActiveComponent('reportsManager')}
                  >
                    Reports Manager
                  </button>
                </>
              )}
              {decoded.role_id === 2 && (
                <button
                  className='nav-button'
                  onClick={() => setActiveComponent('reportsEmployee')}
                >
                  My tasks
                </button>
              )}
              {decoded.role_id === 3 && (
                <button
                  className='nav-button'
                  onClick={() => setActiveComponent('users')}
                >
                  Users
                </button>
              )}
              {decoded.role_id === 4 && (
                <button
                  className='nav-button'
                  onClick={() => setActiveComponent('usersAdmin')}
                >
                  Users
                </button>
              )}
            </>
          )}
          {token && (
            <button className='nav-button' onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        <div className='content'>
          {activeComponent === 'login' && (
            <Login user={user} setUser={setUser} handleLogin={handleLogin} />
          )}
          {activeComponent === 'register' && (
            <Register
              registrationUser={registrationUser}
              setRegistrationUser={setRegistrationUser}
              handleRegister={handleRegister}
            />
          )}
          {activeComponent === 'reports' && (
            <Reports
              reports={reports}
              status={status}
              setStatus={setStatus}
              statuses={statuses}
            />
          )}
          {activeComponent === 'events' && (
            <Events
              decoded={decoded}
              events={events}
              setEvents={setEvents}
              applications={applications}
              setApplications={setApplications}
              allUsers={allUsers}
            />
          )}
          {activeComponent === 'addEvent' && (
            <AddEvent events={events} setEvents={setEvents} decoded={decoded} />
          )}
          {activeComponent === 'reportsEmployee' && (
            <ReportsEmployee
              reports={reports}
              setReports={setReports}
              statuses={statuses}
              decoded={decoded}
            />
          )}
          {activeComponent === 'reportsManager' && (
            <ReportsManager
              reports={reports}
              setReports={setReports}
              employees={employees}
              statuses={statuses}
              decoded={decoded}
            />
          )}
          {activeComponent === 'users' && (
            <Users users={users} employees={employees} reports={reports} />
          )}
          {activeComponent === 'usersAdmin' && (
            <UsersAdmin
              users={users}
              setUsers={setUsers}
              employees={employees}
              setEmployees={setEmployees}
              managers={managers}
              setManagers={setManagers}
            />
          )}
          {activeComponent === 'imageandmapupload' && (
            <ImageAndMapUpload
              decoded={decoded}
              reports={reports}
              setReports={setReports}
            />
          )}
        </div>
      </main>
      <footer>
        <a
          href='https://github.com/bruno-jakobljevic'
          target='_blank'
          rel='noopener noreferrer'
        >
          <span style={{ color: '#ff5722' }}>
            <i className='fa-brands fa-github fa-2xl'></i>
          </span>
          <span className='sr-only'>GitHub</span>
        </a>
        <a
          href='https://www.instagram.com/brunojakobljevic/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <span style={{ color: '#ff5722' }}>
            <i className='fa-brands fa-instagram fa-2xl'></i>
          </span>
          <span className='sr-only'>Instagram</span>
        </a>
        <a
          href='https://www.linkedin.com/in/bruno-jakobljevi%C4%87-3869a5216/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <span style={{ color: '#ff5722' }}>
            <i className='fa-brands fa-linkedin-in fa-2xl'></i>
          </span>
          <span className='sr-only'>Back to Top</span>
        </a>
        <p>&copy; 2024 CleaneST</p>
      </footer>
    </>
  );
};

export default App;

