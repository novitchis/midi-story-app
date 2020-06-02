import { useState, useEffect } from 'react';

function useFFmpegWorker() {
  const [ffmpegAsync, setFFmpegAsync] = useState(null);

  useEffect(() => {
    const worker = new Worker('/Scripts/ffmpeg-worker-webm.js');

    let messageId = 0;
    const callbacks = {};

    worker.onmessage = function (e) {
      const msg = e.data;

      switch (msg.type) {
        case 'ready':
          setFFmpegAsync({
            ffmpeg: (args) => {
              return new Promise((resolve, reject) => {
                callbacks[messageId] = { resolve, reject };
                worker.postMessage({ type: 'run', ...args });

                //messageId++;
              });
            },
          });
          break;
        case 'stdout':
          console.log(msg.data);
          break;
        case 'stderr':
          if (callbacks[messageId]) {
            console.log(msg.data);

            // callbacks[messageId].reject(new Error(msg.data));
          } else {
            setFFmpegAsync({
              error:
                'Could not load encoder script. Please try again in a few minutes.',
            });
          }

          break;
        case 'done':
          if (callbacks[messageId]) {
            callbacks[messageId].resolve(msg.data);
          }
          console.log(msg.data);
          // resolve(msg.data);
          break;
        default:
          break;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...ffmpegAsync };
}

export default useFFmpegWorker;
