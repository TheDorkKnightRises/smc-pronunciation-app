import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChallengePage from './ChallengePage';
import dialogPolyfill from 'dialog-polyfill'

const Favorites = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/favorites/' + localStorage.getItem('username'));
  
        if (!response.ok) {
          // Handle error fetching words
          throw new Error('Error fetching words');
        }
  
        const data = await response.json();
        if (data.length === 0) {
          var error = document.getElementById('error');
          error.style.display = 'block';
        } else setWords(data); // Update the words state with fetched data
      } catch (error) {
        console.error('Fetch Words Error:', error.message);
      }
    };
  
    fetchWords();
  }, []);
  
  return (
    <>
    <Link to={`/`}>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect whiteText"><i className="material-icons">arrow_back_ios</i> Back</button>
    </Link>
    <div className="content mdl-card mdl-shadow--2dp">
      <h4>Favorites</h4>
        {words.map((word) => (
          <span key={word.word} style={{margin: 0.5 + "em"}}>
            <Link to={`/challenge/${word.word}`}>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">
                {word.word} 
              </button>
            </Link>
          </span>
        ))}
        <p id='error' style={{display: 'none'}}> No favorites to show. Try marking words you would like to revisit as favorites!</p>
    </div>
    </>
  );
};

export default Favorites;
