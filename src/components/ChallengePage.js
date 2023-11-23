import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { VoiceRecorder } from 'react-voice-recorder-player';
import dialogPolyfill from 'dialog-polyfill'

const ChallengePage = () => {
  const { word } = useParams();
  const [audioBlob, setAudioBlob] = useState(null);
  const [meanings, setMeanings] = useState([]);
  const [phonetic, setPhonetic] = useState();
  const [phoneticAudioUrl, setPhoneticAudioUrl] = useState();
  const styles = {
    mainContainerStyle: {
      width: '100%',
      margin: 'auto',
      marginTop: 12 + 'px',
      marginBottom: 12 +'px'
    }
  };

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        if (word) {
          const response = await fetch(process.env.REACT_APP_DICTIONARY_API_URL + word);
  
          if (!response.ok) {
            // Handle error fetching words
            throw new Error('Error fetching word info from dictionary API');
          }
    
          const data = await response.json();
          if (data[0].phonetic) {
            setPhonetic(data[0].phonetics[0].text);
            if (data[0].phonetics[0].audio != "") setPhoneticAudioUrl(data[0].phonetics[0].audio);
          }
          for (let i = 0; i < data.length; i++) {
            if (data[i].meanings) {
              setMeanings(data[i].meanings);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Dictionary data fetch Error:', error.message);
      }
    };
  
    fetchWordData();
  }, []);
  
  function getAudio(audio) {
    console.log(audio);
    setAudioBlob(audio);
  }

  function submitAudio() {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('text', word);
      formData.append('audio', audioBlob, 'audio.wav');
      // formData.append('token', localStorage.getItem('token'));
      fetch(process.env.REACT_APP_BASE_URL + '/predict/pronunciation', {
        method: 'POST',
        accept: '*/*',
        body: formData
      });
    } else {
      var dialog = document.querySelector('dialog');
      dialogPolyfill.registerDialog(dialog);
      dialog.querySelector('.text').innerHTML = "Please record yourself using the recorder widget before submitting";
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
      dialog.querySelector('.close').innerHTML = "OK";
      dialog.showModal();
    }
  }
  
  return (word != null) ? (
    <>
    <Link to={`/`}>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent"><i className="material-icons">arrow_back_ios</i> Back</button>
    </Link>
    <div className="content mdl-card mdl-shadow--2dp">
    <h4 style={{fontSize: 2 + 'em', margin: 4 + 'px'}}>{word}</h4> { phoneticAudioUrl ? (<button className="mdl-button mdl-js-button mdl-button--icon" onClick={() => {var audio = new Audio(phoneticAudioUrl); audio.play();}}><i className="material-icons">volume_up</i></button>) : (<></>) }<br/>
      {phonetic ? (<i style={{fontSize: 1 + 'em', margin: 4 + 'px'}}>{phonetic}</i>) : (<></>)}
      {meanings.map((meaning) => (
        <div key={meaning.partOfSpeech}>
          <b>{meaning.partOfSpeech}</b>
          <ul>
            {meaning.definitions.map((definition) => (
              <li key={definition.definition}>{definition.definition}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
      <i>Practice speaking using the recording widget below</i>
      <VoiceRecorder mainContainerStyle={styles.mainContainerStyle} className="recorder" downloadable={true} onAudioDownload={getAudio} />
      <button className="button-center mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent" onClick={submitAudio}><i className="material-icons">upload</i> Submit</button>
    </>
  ) : (<></>);
};

export default ChallengePage;
