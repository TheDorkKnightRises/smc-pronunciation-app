// LoginForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="content mdl-card mdl-shadow--2dp width-60">
        <h3>Login</h3>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /> <br/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" /> <br/>
        <button type="submit" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Login</button>
        <p>Don't have an account?</p>
        <Link to="/register"><button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Register</button></Link>
      </form>
    </div>
  );
};

export default LoginForm;
