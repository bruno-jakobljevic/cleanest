import React from 'react';

function Login({ user, onChange, onSubmit, response }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username:</label>
          <input
            type='text'
            name='username'
            value={user.username}
            onChange={onChange}
            required
          />
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={user.password}
            onChange={onChange}
            required
          />
        </div>
        <button type='submit'>Login</button>
        {response && <div>{response.data.message}</div>}
      </form>
    </>
  );
}

export default Login;
