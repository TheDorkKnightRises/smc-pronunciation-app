import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const state = useLocation().state;
  const data = state.data;
  const word = state.word;
  const sentence = state.sentence;
  const [detectedPhonemes, setDetectedPhonemes] = useState(data.stats.predicted);
  const [detectedString, setDetectedString] = useState('');
  const [expectedPhonemes, setExpectedPhonemes] = useState(data.stats.canonical);
  const [expectedString, setExpectedString] = useState('');

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

  useEffect(() => {
    // Build strings for detected and expected phonemes
    var detected = '';
    var expected = '';
    const deletions = data.stats.deletions;
    const insertions = data.stats.insertions;
    const substitutions = data.stats.substitutions;
 
    for (var i = 0; i < detectedPhonemes.length; i++) {
      var phoneme = detectedPhonemes[i];
      if (detectedPhonemes[i] === 'sil' || detectedPhonemes[i] === '<eps>') {
        phoneme = '•';
      }
      if (deletions.predicted[i]) {
        detected += '<span style="color: #ff0000">' + phoneme + '</span> ';
      } else if (insertions.predicted[i]) {
        detected += '<span style="color: #00A600">' + phoneme + '</span> ';
      } else if (substitutions.predicted[i]) {
        detected += '<span style="color: #0000ff">' + phoneme + '</span> ';
      } else if (phoneme !== '•') {
        detected += phoneme + ' ';
      }
    }
    for (var i = 0; i < expectedPhonemes.length; i++) {
      var phoneme = expectedPhonemes[i];
      if (expectedPhonemes[i] === 'sil' || expectedPhonemes[i] === '<eps>') {
        phoneme = '•';
      }
      if (deletions.canonical[i]) {
        expected += '<span style="color: #ff0000">' + phoneme + '</span> ';
      } else if (insertions.canonical[i]) {
        expected += '<span style="color: #00A600">' + phoneme + '</span> ';
      } else if (substitutions.canonical[i]) {
        expected += '<span style="color: #0000ff">' + phoneme + '</span> ';
      } else if (phoneme !== '•') {
        expected += phoneme + ' ';
      }
    }
    setDetectedString(detected);
    setExpectedString(expected);
  });
  
  return (
    <>
    <Link to={`/`}>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect whiteText"><i className="material-icons">arrow_back_ios</i> Back to home</button>
    </Link>
    <div className="content mdl-card mdl-shadow--2dp centered">
      {(data) ?
      <div className='centered'>
        {(data.score > 75) ? <h4>Great job!</h4> : (data.score > 50) ? <h4>Almost there!</h4>: <h4>Keep practicing!</h4>}
        <div className='flexBox'>
          {(data.score > 25) ? <i className='material-icons stars'>star</i> : <i className='material-icons stars-empty'>star_border</i>}
          {(data.score > 50) ? <i className='material-icons stars'>star</i> : <i className='material-icons stars-empty'>star_border</i>}
          {(data.score > 75) ? <i className='material-icons stars'>star</i> : <i className='material-icons stars-empty'>star_border</i>}
        </div>
        <p>Score: {data.score.toFixed(2)} out of 100</p>
        <p>Word: {word}</p>
        <i className='medium-text'>"{sentence}"</i><hr/>
        <p>Expected phonemes:</p> <p className='medium-text' dangerouslySetInnerHTML={{__html: expectedString}} />
        <p>Detected phonemes:</p> <p className='medium-text' dangerouslySetInnerHTML={{ __html: detectedString}} />
        <hr />
        <p><span style={{color: '#ff0000', fontWeight: 500}}>Deletion</span>: Expected phoneme was not detected in your recording</p>
        <p><span style={{color: '#00A600', fontWeight: 500}}>Insertion</span>: Unexpected extra phoneme was detected in your recording</p>
        <p><span style={{color: '#0000ff', fontWeight: 500}}>Substitutions</span>: Mismatch of phonemes between expectation and recording</p>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={markAsDone}>Mark as Done</button><br/>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={() => window.location.href = `/challenge/${word}`}>Try again</button>
      </div>
      : <p>Error</p>}
    </div>
    </>
  );
};

export default ResultsPage;
