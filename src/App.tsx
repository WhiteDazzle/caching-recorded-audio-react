import React from 'react';
import './App.css';
import { useReactMediaRecorder } from "react-media-recorder";

const getBlob = async (url:any) => {
    let blob = await fetch(url).then(r => r.blob());
    console.log(blob.arrayBuffer())
}

function App() {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
      useReactMediaRecorder({ audio: true });
  return (
      <div>
        <p>{status}</p>
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
        <audio src={mediaBlobUrl} controls/>
          <p> {mediaBlobUrl} </p>
          <button onClick={()=> getBlob(mediaBlobUrl)}>getBlob</button>
      </div>
  );
}

export default App;