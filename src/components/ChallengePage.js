import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { VoiceRecorder } from 'react-voice-recorder-player';
import dialogPolyfill from 'dialog-polyfill'
import Avatar from './Avatar';

const ChallengePage = () => {
  const navigate = useNavigate();
  const { word } = useParams();
  const [username] = useState(localStorage.getItem('username'));
  const [audioBlob, setAudioBlob] = useState(null);
  const [meanings, setMeanings] = useState([]);
  const [phonetic, setPhonetic] = useState();
  const [phoneticARPA, setPhoneticARPA] = useState();
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
              console.log("Data is older than 1 day, deleting cached data");
              localStorage.removeItem(word);
              localData = null;
            } else {
              console.log("Using cached dictionary data");
              setMeanings(localData.meanings);
              setPhonetic(localData.phonetic);
              setPhoneticARPA(localData.phoneticARPA);
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
          var localmeanings = [];
          var localphonetic = "";
          var localphoneticARPA = "";
          var localsentence = "";
          var localphoneticAudioUrl = "";

          if (data[0].phonetic) {
            localphonetic = data[0].phonetics[0].text;
            if (data[0].phonetics[0].audio !== "") localphoneticAudioUrl = data[0].phonetics[0].audio;
          }

          const phResponse = await fetch(process.env.REACT_APP_BASE_URL + '/phonemes/' + word);
          const phData = await phResponse.json();
          // Check if phData is a string
          if (typeof phData === 'string' || phData instanceof String) {
            localphoneticARPA = phData;
          }

          for (let i = 0; i < data.length; i++) {
            if (data[i].meanings) {
              localmeanings = data[i].meanings;
              // Create sentence of form "word is part of speech"
              var sentence = word + " is ";
              for (let j = 0; j < data[i].meanings.length; j++) {
                console.log(data[i].meanings[j].partOfSpeech[0])
                if (['a','e','i','o','u'].includes(data[i].meanings[j].partOfSpeech[0])) sentence += "an ";
                else sentence += "a ";
                sentence += data[i].meanings[j].partOfSpeech;
                if (j < data[i].meanings.length - 1) sentence += " and ";
              }
              localsentence = sentence;
              break;
            }
          }
          setMeanings(localmeanings);
          setPhonetic(localphonetic);
          setPhoneticARPA(localphoneticARPA);
          setSentence(localsentence);
          setPhoneticAudioUrl(localphoneticAudioUrl);

          localStorage.setItem(word, JSON.stringify({meanings: localmeanings, phonetic: localphonetic, phoneticARPA: localphoneticARPA, sentence: localsentence, phoneticAudioUrl: localphoneticAudioUrl, lastUpdated: new Date()}));
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

  async function submitAudio() {
    var dialog = document.querySelector('dialog');
    if (audioBlob) {
      const formData = new FormData();
      formData.append('name', username);
      formData.append('text', sentence);
      formData.append('audio', audioBlob, username + '_' + word + '.webm');
      // formData.append('token', localStorage.getItem('token'));
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/predict/pronunciation', {
        method: 'POST',
        accept: '*/*',
        body: formData
      });

      if (!response.ok) {
        dialogPolyfill.registerDialog(dialog);
        dialog.querySelector('.text').innerHTML = 'Error submitting and evaluating audio. Please try again later.'
        
        dialog.querySelector('.close').addEventListener('click', function() {
          dialog.close();
        });
        dialog.querySelector('.close').innerHTML = "OK";
        dialog.showModal();
        return;
      }

      const data = await response.json();
      console.log(data);
      // Navigate to results page and pass the data
      navigate(`/results`, { state: { data: data, word: word, sentence: sentence } });
      
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
    <h4 style={{fontSize: 2 + 'em', margin: 4 + 'px'}}>{word}</h4> <hr/>
    <Avatar word={word} sentence={sentence} /><hr/>
      { (phonetic || phoneticARPA) ? (<b>phonemes</b>) : (<></>)}
      {phonetic ? (<i style={{fontSize: 1 + 'em', margin: 4 + 'px'}}>{phonetic} (IPA)</i>) : (<></>)}
      {phoneticARPA ? (<i style={{fontSize: 1 + 'em', margin: 4 + 'px'}}>{phoneticARPA} (ARPABET)</i>) : (<></>)}
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
      <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={submitAudio}><i className="material-icons">upload</i> Submit</button>
    </div>
    </>
  ) : (<></>);
};

export default ChallengePage;
