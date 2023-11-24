import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const state = useLocation().state;
  const data = state.data;
  const word = state.word;
  const sentence = state.sentence;

  const markAsDone = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/user/progress/done', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: localStorage.getItem('username'), word: word, done: 'true', favorite: 'false', score: ''}),
      });

      if (!response.ok) {
        // Handle login failure, display an error message
        throw new Error('Mark as done failed');
      }

      const data = await response.json();
      console.log(data);
      window.location.href = `/`;
    } catch (error) {
      // Handle errors such as network failure or incorrect credentials
      console.error('Mark as done Error:', error.message);
    }
  };
  
  return (
    <>
    <Link to={`/`}>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect whiteText"><i className="material-icons">arrow_back_ios</i> Back to home</button>
    </Link>
    <div className="content mdl-card mdl-shadow--2dp">
      {(data) ?
      <div className='centered'>
        {(data.score > 75) ? <h4>Great job!</h4> : (data.score > 50) ? <h4>Almost there!</h4>: <h4>Keep practicing!</h4>}
        <div className='flexBox'>
          {(data.score > 25) ? <i className='material-icons'>star</i> : <i className='material-icons'>star_border</i>}
          {(data.score > 50) ? <i className='material-icons'>star</i> : <i className='material-icons'>star_border</i>}
          {(data.score > 75) ? <i className='material-icons'>star</i> : <i className='material-icons'>star_border</i>}
        </div>
        <p>Score: {data.score.toFixed(2)}</p>
        <p>Expected phonemes:</p> <p>{data.stats.canonical.filter((e) =>  e !== 'sil' && e !== '<eps>').join(' ')}</p>
        <p>Detected phonemes:</p> <p>{data.stats.predicted.filter((e) =>  e !== 'sil' && e !== '<eps>').join(' ')}</p>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={markAsDone}>Mark as Done</button><br/>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => window.location.href = `/challenge/${word}`}>Try again</button>
      </div>
      : <p>Error</p>}
    </div>
    </>
  );
};

export default ResultsPage;
