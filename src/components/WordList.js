import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChallengePage from './ChallengePage';
import dialogPolyfill from 'dialog-polyfill'

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
  
  const search = async (e) => {
    e.preventDefault();
    const searchWord = document.getElementById("expando1").value;
    if (searchWord === "") {
      return;
    }
    console.log("Searching for " + searchWord);
    const response = await fetch(process.env.REACT_APP_DICTIONARY_API_URL + searchWord);
    if (!response.ok) {
      var dialog = document.querySelector('dialog');
      dialogPolyfill.registerDialog(dialog);
      dialog.querySelector('.text').innerHTML = "Word not found";
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
      dialog.querySelector('.close').innerHTML = "Close";
      dialog.showModal();
    } else {
      window.location.href = `/challenge/${searchWord}`;
    }
  };

  return (
    <div className="content mdl-card mdl-shadow--2dp">
      <div className="flexBox" style={{maxWidth: 300 + 'px'}}>
        <input className="mdl-textfield__input" type="text" id="expando1" placeholder='Search for a word' onSubmit={search} />
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={search}><i className="material-icons">search</i></button>
      </div>
      
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
