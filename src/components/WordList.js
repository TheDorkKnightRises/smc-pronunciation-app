import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChallengePage from './ChallengePage';

const WordList = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/words');
  
        if (!response.ok) {
          // Handle error fetching words
          throw new Error('Error fetching words');
        }
  
        const data = await response.json();
        setWords(data); // Update the words state with fetched data
      } catch (error) {
        console.error('Fetch Words Error:', error.message);
      }
    };
  
    fetchWords();
  }, []);
  

  return (
    <div className="content mdl-card mdl-shadow--2dp">
      <h4>Pick a word to practice!</h4>
        {words.map((word) => (
          <span key={word.wordid} style={{margin: 0.5 + "em"}}>
            <Link to={`/challenge/${word.word}`}>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                {word.word} 
              </button>
            </Link>
          </span>
        ))}
    </div>
  );
};

export default WordList;
