import React from 'react';

function Register({ user, onChange, onSubmit, response }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        <h2>Register:</h2>
        <div>
          <label>E-mail:</label>
          <input
            type='email'
            name='email'
            value={user.email}
            onChange={onChange}
            required
          />
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
        <button type='submit'>Submit User</button>
        {response && <div>{response.data.message}</div>}
      </form>
    </>
  );
}

export default Register;
