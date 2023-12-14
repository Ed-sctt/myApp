/// api shazam song detection - MUSIC RECOGNITION Section
// PROBLEM AVEC LA GESTION DU SON
const TOKEN ='c5f6cb2180msh8d8b932e5f500bfp1a1adajsn6704ba305f3d' ;// add your own token from rapidapi.com
const myObject = (function() { 
  async function _startAudioCapture() {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new AudioContext({ sampleRate: 44100 });
          const source = audioContext.createMediaStreamSource(stream);
          
          const processor = audioContext.createScriptProcessor(16384, 1, 1); // Adjust buffer size as needed
          
          let recordedData = [];

          processor.onaudioprocess = function(event) {
              const audioData = event.inputBuffer.getChannelData(0);
              recordedData.push(new Float32Array(audioData));
          };

          source.connect(processor);
          processor.connect(audioContext.destination);

          return {
              audioContext,
              stream,
              processor,
              recordedData
          };
      } catch (error) {
          console.error('Error accessing microphone:', error);
          return null;
      }
  }

  function _stopRecording(audioContext, stream, processor) {
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
      processor.disconnect();
  }

  function _convertTo16BitPCM(floatData) {
      const pcmData = new Int16Array(floatData.length);

      for (let i = 0; i < floatData.length; i++) {
          const sample = Math.max(-1, Math.min(1, floatData[i]));
          pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      }

      return pcmData;
  }

  async function _byteArrayToBase64(byteArray) {
      const binaryString = await byteArray.map(byte => String.fromCharCode(byte)).join('');
      return btoa(binaryString);
  }

  return {
      startAudioCapture() {
          return _startAudioCapture();
      },
      stopRecording(audioContext, stream, processor) {
          _stopRecording(audioContext, stream, processor);
      },
      convertTo16BitPCM(floatData) {
          return _convertTo16BitPCM(floatData);
      },
      byteArrayToBase64(byteArray) {
          return _byteArrayToBase64(byteArray);
      }
  };
})();

const search_music = document.getElementById('Run');

search_music.addEventListener('click', async () => {
  console.log('click event triggered');

  const audioCapture = await myObject.startAudioCapture();
  if (audioCapture) { // Check if audioCapture is valid
      const pcmData = myObject.convertTo16BitPCM(new Float32Array(audioCapture.recordedData.reduce((acc, curr) => acc.concat(Array.from(curr)), [])));
      const base64Data = await myObject.byteArrayToBase64(new Uint8Array(pcmData.buffer));
      console.log(base64Data);

      // Space bar event
     const spacebar = window.addEventListener('keydown', async (e) => {
          if (e.key === 'Space' || e.key === ' ') {
              console.log('spacebar event triggered'); // PROBLEM AVEC LA GESTION DU SON
              if (audioCapture) {
                  const pcmData = myObject.convertTo16BitPCM(new Float32Array(audioCapture.recordedData.reduce((acc, curr) => acc.concat(Array.from(curr)), [])));
                  if (pcmData) {
                      const base64Data = await myObject.byteArrayToBase64(new Uint8Array(pcmData.buffer));
                      console.log(base64Data);

                      // API SHAZAM
                      const url = 'https://shazam.p.rapidapi.com/songs/v2/detect?timezone=America%2FChicago&locale=en-US';
                      const options = {
                        method: 'POST',
                        headers: {
                          'content-type': 'text/plain',
                          'X-RapidAPI-Key': TOKEN,
                          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
                        },
                        body: base64Data
                      };

                      try {
                        const response = await fetch(url, options);
                        const result = await response.json();
                        console.log('SHAZAM API RESULTS', result);
                      } catch (error) {
                        console.error('Error sending request to Shazam API:', error);
                      }
                  } 
                  else {
                      console.log('ERROR');
                  }
              }
              myObject.stopRecording(audioCapture.audioContext, audioCapture.stream, audioCapture.processor);
          }
          throw 'exit'; // exit the async function
      });
    
  }
});

