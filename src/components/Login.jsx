import React from 'react';

const Login = ({ user, setUser, handleLogin }) => {
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>LOGIN</h1>
      <input
        type='text'
        name='username'
        value={user.username}
        onChange={handleChange}
        placeholder='Username'
      />
      <input
        type='password'
        name='password'
        value={user.password}
        onChange={handleChange}
        placeholder='Password'
      />
      <button className='event-button' type='submit'>
        Login
      </button>
    </form>
  );
};

export default Login;
