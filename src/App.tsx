import React, {useState} from 'react';
import './App.css';
import { useReactMediaRecorder } from "react-media-recorder";

function getBlobFromBase64Data(b64Data:any, contentType:any, sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

const convert = function (audioFileData: any, targetFormat: string) {
    try {
        targetFormat = targetFormat.toLowerCase();
        let reader = new FileReader();
        return new Promise(resolve => {
            reader.onload = function (event) {
                let contentType = 'audio/'+targetFormat;
                console.log(event)
                //@ts-ignore
                let data = event.target.result.split(',');
                let b64Data = data[1];
                let blob = getBlobFromBase64Data(b64Data, contentType);
                let blobUrl = URL.createObjectURL(blob);
                let convertedAudio = {
                    name: audioFileData.name.substring(0, audioFileData.name.lastIndexOf(".")),
                    format: targetFormat,
                    data: blobUrl
                }
                resolve(convertedAudio);
            }
            reader.readAsDataURL(audioFileData);
        });

    } catch (e) {
        console.log(1111);
    }
}

const getMP3 = async (url:any) => {
    let blob = await fetch(url).then(r => r.blob()).then(blob => {
        const file = new File([blob], "foo.x-wav", {
            type: "audio/x-wav",
        });
        return convert(file, 'mp3')
    })
    return blob
}

function App() {
    const [linkMP3, setLinkMP3] = useState('')
    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({ audio: true });
    const handleCreateMP3 = async () => {
        const fileMP3:any = await getMP3(mediaBlobUrl)
        console.log(fileMP3)
        setLinkMP3(fileMP3.data)
    }
    return (
        <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <audio src={mediaBlobUrl} controls/>
            <p> {mediaBlobUrl} </p>
            <button onClick={handleCreateMP3}>Нажать для генерации мп3</button>
            <a download href={linkMP3}>скачать мп3</a>
        </div>
    );
}

export default App;
