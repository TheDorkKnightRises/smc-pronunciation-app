import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ScannedWords = () => {
  const navigate = useNavigate();
  const state = useLocation().state;
  const words = state.words;

  const goBack = () => {
		navigate(-1);
	}

  return (
    <>
    <button className="mdl-button mdl-js-button mdl-js-ripple-effect whiteText" onClick={goBack}><i className="material-icons">arrow_back_ios</i> Back</button>
    <div className="content mdl-card mdl-shadow--2dp">
      <h4>Detected words</h4> <hr/>
          <span className='flex-wrap' >
        {words.map((word) => (
            <Link key={word} to={`/challenge/${word}`}>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" style={{margin: 0.5 + "em"}}>
                {word} 
              </button>
            </Link>
        ))}
        </span>
        <p id='error' style={{display: 'none'}}> No scanned words!</p>
    </div>
    </>
  );
};

export default ScannedWords;
