import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import WordList from './components/WordList';
import ChallengePage from './components/ChallengePage';
import Avatar from "./components/Avatar";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [username, setUsername] = useState('Sam');
  
  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('/auth/login', {
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
      // Assuming your backend returns a token upon successful login
      const token = data.token; // Adjust this based on your backend response structure

      setUsername(data.username);
  
      // Store the token in localStorage or sessionStorage for subsequent requests
      localStorage.setItem('token', token);
  
      // Set the loggedIn state to true
      setLoggedIn(true);
    } catch (error) {
      // Handle errors such as network failure or incorrect credentials
      console.error('Login Error:', error.message);
    }
  };
  

  return (
    <Router>
      <div>
        {loggedIn ? (
          <>
            <h3>Welcome {username}</h3> <br/>
            <Routes>
              <Route path="/challenge/:wordId" element={<ChallengePage />} />
              <Route path="/avatar" element={<Avatar />} />
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
