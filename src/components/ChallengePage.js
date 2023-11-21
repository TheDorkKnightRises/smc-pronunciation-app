import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VoiceRecorder } from 'react-voice-recorder-player';



const ChallengePage = () => {
  const { wordId } = useParams();
  const [audioBlob, setAudioBlob] = useState(null);
  
  function getAudio(audio) {
    console.log(audio);
    setAudioBlob(audio);
  }
  // Fetch word details or use the wordId to display specific information

  return (
    <div className="content mdl-card mdl-shadow--2dp">
      <h4>Challenge Page</h4>
      {/* Display word details and the audio recording/upload functionality */}
      <VoiceRecorder downloadable={false} onAudioDownload={getAudio} />
    </div>
  );
};

export default ChallengePage;
