// ImagePicker.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import dialogPolyfill from 'dialog-polyfill';

const ImagePicker = ({ handleLogin }) => {
  const navigate = useNavigate();
  const inputFile = useRef(null);
  const [ processing, setProcessing ] = useState(false);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const recognizeText = async () => {
    const selectedImage = inputFile.current.files[0];
    if (selectedImage) {
      setProcessing(true);
      const result = await Tesseract.recognize(selectedImage);
      if (result.data.text) {
        setProcessing(false);
        console.log("Recognized text: " + result.data.text);
        // Split text into words
        var words = result.data.text.split(" ");
        // Remove empty strings
        words = words.filter(function (el) {
          return el !== "";
        });
        // Remove duplicates
        words = [...new Set(words)];
        // Remove words with non-alphabet characters
        words = words.filter(function (el) {
          return /^[a-zA-Z]+$/.test(el);
        });
        // Remove words with less than 4 characters
        words = words.filter(function (el) {
          return el.length > 3;
        });
        // Remove words with more than 12 characters
        words = words.filter(function (el) {
          return el.length < 13;
        });
        if (words.length > 0) {
          console.log("Valid words: " + words);
          navigate('/scanned', { state: { words: words } })
        } else {
          var dialog = document.querySelector('dialog');
          dialogPolyfill.registerDialog(dialog);
          dialog.querySelector('.text').innerHTML = "No valid words found";
          dialog.querySelector('.close').addEventListener('click', function () {
            dialog.close();
          });
          dialog.querySelector('.close').innerHTML = "Close";
          dialog.showModal();
        }
      }
    }
  };

  return (
    <div className='fab'>
      <input type="file" accept="image/*" capture="camera" ref={inputFile} style={{display: 'none'}} onChange={recognizeText}/>
      { processing ? <span className="mdl-chip">
        <span className="mdl-chip__text">Processing, please wait...</span>&nbsp;
      </span> : null}
      
      <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--8dp" id="scanner" onClick={onButtonClick}>
        <i className="material-icons">photo_camera</i>
      </button>
      <div className="mdl-tooltip" htmlFor="scanner">
        Scan a word
      </div>
    </div>
  );
};

export default ImagePicker;
