import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { VoiceRecorder } from 'react-voice-recorder-player';
import dialogPolyfill from 'dialog-polyfill'
import Avatar from './Avatar';

const ChallengePage = () => {
  const { word } = useParams();
  const [username] = useState(localStorage.getItem('username'));
  const [audioBlob, setAudioBlob] = useState(null);
  const [meanings, setMeanings] = useState([]);
  const [phonetic, setPhonetic] = useState();
  const [sentence, setSentence] = useState();
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
          var localData = JSON.parse(localStorage.getItem(word));
          if (localData) {
            // Check if data is older than 1 day
            var today = new Date();
            var lastUpdated = new Date(localData.lastUpdated);
            if (today.getDate() !== lastUpdated.getDate()) {
              localStorage.removeItem(word);
              localData = null;
            } else {
              setMeanings(localData.meanings);
              setPhonetic(localData.phonetic);
              setSentence(localData.sentence);
              setPhoneticAudioUrl(localData.phoneticAudioUrl);
              return;
            }
          }

          const response = await fetch(process.env.REACT_APP_DICTIONARY_API_URL + word);
  
          if (!response.ok) {
            // Handle error fetching words
            throw new Error('Error fetching word info from dictionary API');
          }
    
          const data = await response.json();
          if (data[0].phonetic) {
            setPhonetic(data[0].phonetics[0].text);
            if (data[0].phonetics[0].audio !== "") setPhoneticAudioUrl(data[0].phonetics[0].audio);
          }
          for (let i = 0; i < data.length; i++) {
            if (data[i].meanings) {
              setMeanings(data[i].meanings);
              // Create sentence of form "word is part of speech"
              var sentence = word + " is ";
              for (let j = 0; j < data[i].meanings.length; j++) {
                if (data[i].meanings[j].partOfSpeech === "adjective") sentence += "an ";
                else sentence += "a ";
                sentence += data[i].meanings[j].partOfSpeech;
                if (j < data[i].meanings.length - 1) sentence += " and ";
              }
              setSentence(sentence);
              break;
            }
          }
          localStorage.setItem(word, JSON.stringify({meanings: meanings, phonetic: phonetic, sentence: sentence, phoneticAudioUrl: phoneticAudioUrl, lastUpdated: new Date()}));
        }
      } catch (error) {
        console.error('Dictionary data fetch Error:', error.message);
      }
    };
  
    fetchWordData();
  });
  
  function getAudio(audio) {
    console.log(audio);
    setAudioBlob(audio);
  }

  async function submitAudio() {
    var dialog = document.querySelector('dialog');
    if (audioBlob) {
      const formData = new FormData();
      formData.append('text', sentence);
      formData.append('audio', audioBlob, username + '_' + word + '.webm');
      // formData.append('token', localStorage.getItem('token'));
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/predict/pronunciation', {
        method: 'POST',
        accept: '*/*',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      dialogPolyfill.registerDialog(dialog);
      dialog.querySelector('.text').innerHTML = (response.ok) ? 
        '<b>Score: '+ data.score +'</b>'
       : '';
      
      dialog.querySelector('.close').addEventListener('click', function() {
        dialog.close();
      });
      dialog.querySelector('.close').innerHTML = "OK";
      dialog.showModal();
    } else {
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
    <div style={{textAlign: 'center'}}>
      <i>Practice speaking the following sentence using the recording widget below</i><br/>
      <h4 style={{fontFamily: 'bold'}}>"{sentence}"</h4>
      <VoiceRecorder mainContainerStyle={styles.mainContainerStyle} className="recorder" downloadable={true} onAudioDownload={getAudio} />
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent" onClick={submitAudio}><i className="material-icons">upload</i> Submit</button>
    </div>
    </>
  ) : (<></>);
};

export default ChallengePage;
