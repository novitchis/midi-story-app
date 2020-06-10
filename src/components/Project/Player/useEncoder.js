import { useState, useEffect } from 'react';
// import useFFmpeg from './useFFmpeg';
import useFFmpegWorker from './useFFmpegWorker';

const CHUNK_SIZE = 60;

function useEncoder() {
  const { ffmpeg, resetWork, error } = useFFmpegWorker(null);
  const [encoder, setEncoder] = useState(null);

  useEffect(() => {
    if (!ffmpeg) return;
    setEncoder(getEncoder(ffmpeg, resetWork));
  }, [ffmpeg, resetWork]);

  if (ffmpeg === null) return { encoder: null, error };

  return { encoder };
}

const getEncoder = (ffmpeg, resetWork) => {
  let fileInfo = null;
  let framesCount = 0;
  let startTime = null;
  let fps = -1;
  let isEncoding = false;

  let chunks = null;
  let outputChunks = null;
  let encodePromise = null;

  const start = (fInfo) => {
    fileInfo = fInfo;
    framesCount = 0;
    startTime = Date.now();
    chunks = [];
    outputChunks = [];
    isEncoding = true;

    startEncoding();
  };

  const addFrame = (imageName, FS) => {
    if (!imageName || (framesCount !== 0 && framesCount % CHUNK_SIZE === 0)) {
      const workingDirectory = FS.lookupPath('/working');
      const memfs = [];

      for (let fileKey in workingDirectory.node.contents) {
        if (fileKey.endsWith('.png')) {
          memfs.push({
            name: fileKey,
            data: FS.readFile(
              FS.getPath(workingDirectory.node.contents[fileKey]),
              { encoding: 'binary' }
            ),
          });
          FS.unlink(FS.getPath(workingDirectory.node.contents[fileKey]));
        }
      }

      chunks.push({
        MEMFS: memfs,
        // prettier-ignore
        arguments: [
        '-framerate', '60', "-start_number", (framesCount - memfs.length).toFixed(0), '-i', "img%5d.png", 
        '-c:v', 'libvpx', '-qmin', '0', '-qmax','50', "-crf", '4', '-b:v', '2M', '-c:a', 'libvorbis', 'frame.webm'
        ]
      });
    }

    framesCount++;
    return Boolean(imageName);
  };

  const startEncoding = () => {
    encodePromise = new Promise((resolve, reject) => {
      const encodeNextChunk = () => {
        if (chunks.length > 0) {
          const encodeBatchStart = Date.now();
          const currentChunk = chunks.shift();

          ffmpeg(currentChunk).then((result) => {
            outputChunks.push(result.MEMFS[0].data);

            fps =
              currentChunk.MEMFS.length /
              ((Date.now() - encodeBatchStart) / 1000);

            encodeNextChunk();
          });
        } else {
          if (isEncoding) setTimeout(encodeNextChunk, 5000);
          else resolve();
        }
      };

      encodeNextChunk();
    });
  };

  const endEncoding = () => {
    return new Promise((resolve, reject) => {
      // concatenate each frame into output video
      if (!isEncoding) {
        reject(new Error('Encoding is not started.'));
        return;
      }

      isEncoding = false;

      encodePromise.then(() => {
        // concatenate all chunks into final video
        const memfs = outputChunks.map((outputChunk, index) => ({
          name: `chunk${index}.webm`,
          data: outputChunk,
        }));

        const list = memfs.reduce(
          (acc, currentValue) => acc + `\nfile '${currentValue.name}'`,
          ''
        );
        memfs.push({ name: 'list.txt', data: new TextEncoder().encode(list) });

        ffmpeg({
          MEMFS: memfs,
          // prettier-ignore
          arguments: ['-f', 'concat', '-i', 'list.txt', '-c', 'copy',  'output.webm']
        })
          .then((result) => {
            outputChunks = [];
            resolve({
              duration: Math.floor(framesCount / 60),
              data: result.MEMFS[0].data,
            });
          })
          .catch(reject);
      });
    });
  };

  const cancel = () => {
    isEncoding = false;
    chunks = [];
    resetWork();
  };

  const getStats = () => {
    if (!fileInfo) return null;

    const timeSpent = (Date.now() - startTime) / 1000;
    const framesEncoded = Math.min(
      outputChunks.length * CHUNK_SIZE,
      fileInfo.length * 60
    );

    return {
      framesEncoded,
      timeSpent,
      timeLeft: fps !== -1 ? (fileInfo.length * 60 - framesEncoded) / fps : -1,
      percentageBuffer: (framesCount / (fileInfo.length * 60)) * 100,
      percentageDone: (framesEncoded / (fileInfo.length * 60)) * 100,
      fps,
      fpsAverage: framesCount / timeSpent,
    };
  };

  return {
    start,
    addFrame,
    endEncoding,
    cancel,
    getStats,
  };
};

export default useEncoder;
