import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WordList from './components/WordList';
import ChallengePage from './components/ChallengePage';
import Avatar from "./components/Avatar";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(JSON.parse(localStorage.getItem('loggedIn')));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        // Handle login failure, display an error message
        throw new Error('Login failed');
      }
  
      const data = await response.json();

      const token = data.access_token;
      setUsername(data.username);
      setUserEmail(credentials.email);
      console.log("Logged in as " + data.username + " with email " + credentials.email)
  
      // Store the token in localStorage or sessionStorage for subsequent requests
      localStorage.setItem('token', token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userEmail', credentials.email);
      localStorage.setItem('loggedIn', true);
  
      // Set the loggedIn state to true
      setLoggedIn(true);
    } catch (error) {
      // Handle errors such as network failure or incorrect credentials
      console.error('Login Error:', error.message);
    }
  };

  const logout = () => {
    setUsername(null);
    setUserEmail(null);
    console.log("Logged out");

    // Reset the token in localStorage
    localStorage.setItem('token', "");
    localStorage.setItem('username', "User");
    localStorage.setItem('userEmail', "");
    localStorage.setItem('loggedIn', false);

    // Set the loggedIn state to true
    setLoggedIn(false);
  };
  

  return (
    <Router>
      <div>
        {loggedIn ? (
          <>
            <h3>Hello {username}    <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent" onClick={logout}>Logout</button></h3><br/>
            <Routes>
              <Route path="/challenge/:word" element={<ChallengePage />} />
              <Route path="/avatar/:sentence" element={<Avatar />} />
              <Route path="/" element={<WordList />} />
            </Routes>
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<LoginForm handleLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
