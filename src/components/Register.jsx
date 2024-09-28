const Register = ({
  registrationUser,
  setRegistrationUser,
  handleRegister,
}) => {
  const handleChange = (e) => {
    setRegistrationUser({
      ...registrationUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <form onSubmit={handleRegister}>
        <h1>REGISTER</h1>
        <div>
          <label>E-mail:</label>
          <input
            type='email'
            name='email'
            value={registrationUser.email}
            onChange={handleChange}
            required
          />
          <label>Username:</label>
          <input
            type='text'
            name='username'
            value={registrationUser.username}
            onChange={handleChange}
            required
          />
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={registrationUser.password}
            onChange={handleChange}
            required
          />
          <label>Confirm Password:</label>
          <input
            type='password'
            name='confirmPassword'
            value={registrationUser.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button className='event-button' type='submit'>
          Register
        </button>
      </form>
    </>
  );
};

export default Register;
