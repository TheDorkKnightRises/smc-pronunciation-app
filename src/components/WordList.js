import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WordList = () => {
  const [words, setWords] = useState([{ id: 1, word: 'Hello', done: true}, { id: 2, word: 'World', done: false}, { id: 3, word: 'React', done: false}]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await fetch('/api/words', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
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
      <ul>
        {words.map((word) => (
          <ul key={word.id} style={{margin: 1 + "em"}}>
            <Link to={`/challenge/${word.id}`}>
              <button className={word.done? ("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent") : ("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button")}>
                {word.word} 
              </button>
            </Link>
          </ul>
        ))}
      </ul>
    </div>
  );
};

export default WordList;
