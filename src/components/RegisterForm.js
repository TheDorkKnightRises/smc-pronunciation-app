// RegisterForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ handleRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      alert('Passwords do not match');
      return false;
    }
    handleRegistration({ email, password, username });
  };

  return (
    <form onSubmit={handleSubmit} className="content mdl-card mdl-shadow--2dp width-60">
      <h3>Register</h3>
      <input type="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" /> <br/>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> <br/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /> <br/>
      <input type="password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" /> <br/>
      <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Register</button>
      <p>Already have an account?</p>
      <Link to="/"><button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Login</button></Link>
    </form>
  );
};

export default RegisterForm;
