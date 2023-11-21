import React, { useState, useRef } from 'react';

const RecordPage = () => {
  const [audioStream, setAudioStream] = useState(null);
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const audioRecorder = useRef(null);

  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
  
      const audioRecorder = new MediaRecorder(stream); // Use 'stream' directly
  
      const audioChunks = [];
      audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };
  
      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };
  
      audioRecorder.start();
      setAudioRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  

  const stopRecordingAudio = () => {
    if (audioRecorder && audioRecorder.state === 'recording') {
      audioRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioRecorder.stop();
          audioStream.getTracks().forEach(track => track.stop());
          setAudioRecording(false);
        }
      };
    }
  };  
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
  };

  return (
    <div>
      <h1>Pronunciation Practice</h1>
      <p>Word/Phrase to Pronounce: "Word 1"</p>
      {audioRecording ? (
        <div>
          <button onClick={stopRecordingAudio}>Stop Audio Recording</button>
        </div>
      ) : (
        <div>
          <button onClick={startRecordingAudio}>Start Audio Recording</button>
        </div>
      )}
      {audioUrl && (
        <div>
          <audio controls autoPlay src={audioUrl} />
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && (
        <div>
          <img src={selectedImage} alt="Selected Image" />
        </div>
      )}
    </div>
  );
};

export default RecordPage;
