import React from 'react';
import { Link } from 'react-router-dom';

const EvaluatePage = () => {
  return (
    <div>
      <h1>Pronunciation Evaluation</h1>
      <p>Word/Phrase: "Word 1"</p>
      <p>Evaluation Result: 4 Stars</p>
      <p>Feedback: Your pronunciation is good!</p>
      <Link to="/">Back to Word Selection</Link>
    </div>
  );
};

export default EvaluatePage;
