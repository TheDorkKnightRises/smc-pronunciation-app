import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { VoiceRecorder } from 'react-voice-recorder-player';
import dialogPolyfill from 'dialog-polyfill'
import Avatar from './Avatar';

const ChallengePage = () => {
  const navigate = useNavigate();
  const { word } = useParams();
  const [error, setError] = useState(false);
  const [username] = useState(localStorage.getItem('username'));
  const [audioBlob, setAudioBlob] = useState(null);
  const [meanings, setMeanings] = useState([]);
  const [phonetic, setPhonetic] = useState();
  const [phoneticARPA, setPhoneticARPA] = useState();
  const [sentence, setSentence] = useState();
  const [phoneticAudioUrl, setPhoneticAudioUrl] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
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
            console.log('Error fetching word info from dictionary API');
            setError(true);
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
              for (let j = 0; j < localmeanings.length; j++) {
                // Check if any meaning has an example sentence
                if (localmeanings[j].definitions[0].example) {
                  localsentence = localmeanings[j].definitions[0].example;
                  break;
                }
              }
              if (localsentence !== "") break;
              // Create sentence of form "word is part of speech"
              var sentence = word + " is ";
              for (let j = 0; j < data[i].meanings.length; j++) {
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

    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/favorites/' + localStorage.getItem('username'));
  
        if (!response.ok) {
          // Handle error fetching words
          throw new Error('Error fetching favorites');
        }
  
        const data = await response.json();
        console.log(data);
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].word === word) {
              setIsFavorite(true);
              break;
            }
          }
        }
      } catch (error) {
        console.error('Fetch favorites Error:', error.message);
      }
    };
  
  
    fetchWordData();
    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    // Disable the button temporarily
    document.getElementById("favoriteBtn").disabled = true;
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    try {
      const response = await fetch(process.env.REACT_APP_BASE_URL + '/user/progress/favorite', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: localStorage.getItem('username'), word: word, done: 'false', favorite: newFavorite.toString(), score: ''}),
      });

      if (!response.ok) {
        // Handle login failure, display an error message
        throw new Error('Toggle favorite failed');
      }

      const data = await response.json();
      console.log(data);
      // Re-enable the button
      document.getElementById("favoriteBtn").disabled = false;
    } catch (error) {
      // Handle errors such as network failure or incorrect credentials
      console.error('Mark as done Error:', error.message);
    }
  };
  
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

  const goBack = () => {
		navigate(-1);
	}
  
  return (word != null) ? (
    <>
    <div className='flex-justify'>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect whiteText" onClick={goBack}><i className="material-icons">arrow_back_ios</i> Back</button>
      <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon whiteText" id="favoriteBtn" onClick={toggleFavorite}>
        { isFavorite ? <i className="material-icons">bookmark</i> : <i className="material-icons">bookmark_border</i> }
      </button>
    </div>
    {error ? 
    (<div className="content mdl-card mdl-shadow--2dp">
      <h4 style={{fontSize: 2 + 'em', margin: 4 + 'px'}}>{word}</h4> <hr/>
      <p style={{fontSize: 1.2 + 'em', margin: 4 + 'px'}}>Could not find this word in the dictionary. Are you sure this word exists?</p>
      </div>) : 
    (<>
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
    </>)}
    
    </>
  ) : (<></>);
};

export default ChallengePage;
