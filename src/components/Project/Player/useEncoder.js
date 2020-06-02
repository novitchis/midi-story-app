import { useState, useEffect } from 'react';
// import useFFmpeg from './useFFmpeg';
import useFFmpegWorker from './useFFmpegWorker';

const BATCH_SIZE = 120;

function useEncoder() {
  const { ffmpeg, error } = useFFmpegWorker(null);
  const [encoder, setEncoder] = useState(null);

  useEffect(() => {
    if (!ffmpeg) return;
    setEncoder(getEncoder(ffmpeg));
  }, [ffmpeg]);

  if (ffmpeg === null) return { encoder: null, error };

  return { encoder };
}

const getEncoder = (ffmpeg) => {
  let fileInfo = null;
  let framesCount = 0;
  let startTime = null;
  let encodeBatchStart = null;
  let fps = 0;
  let isEncoding = false;

  let chunks = null;
  let outputChunks = null;

  const start = (fInfo) => {
    fileInfo = fInfo;
    framesCount = 0;
    startTime = Date.now();
    chunks = [];
    outputChunks = [];
    isEncoding = true;

    updateBatchStats();
    startEncoding();
  };

  const addFrame = (imageName, FS) => {
    if (!imageName || (framesCount !== 0 && framesCount % BATCH_SIZE === 0)) {
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

      updateBatchStats();
    }

    framesCount++;
    return Boolean(imageName);
  };

  const startEncoding = () => {
    const encodeNextChunk = () => {
      if (!isEncoding) return;

      if (chunks.length > 0) {
        ffmpeg(chunks.shift()).then((result) => {
          console.log('Processed', outputChunks);
          outputChunks.push(result.MEMFS[0].data);
          encodeNextChunk();
        });
      } else {
        //TODO: stop this when is over
        setTimeout(encodeNextChunk, 5000);
      }
    };

    encodeNextChunk();
  };

  const endEncoding = () => {
    return new Promise((resolve, reject) => {
      // concatenate each frame into output video
      if (!isEncoding) {
        reject(new Error('Encoding is not started.'));
        return;
      }

      isEncoding = false;
      chunks = [];

      // concatenate all chunks into final video
      const memfs = outputChunks.map((outputChunk, index) => ({
        name: `chunk${index}.webm`,
        data: outputChunk,
      }));

      const list = memfs.reduce(
        (acc, currentValue) => acc + `file '${currentValue.name}'\n`,
        ''
      );
      console.log(memfs);
      console.log(list);
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
  };

  const updateBatchStats = () => {
    fps =
      encodeBatchStart === null
        ? -1
        : BATCH_SIZE / ((Date.now() - encodeBatchStart) / 1000);
    encodeBatchStart = Date.now();
  };

  const getStats = () => {
    if (!fileInfo) return null;

    const timeSpent = (Date.now() - startTime) / 1000;

    return {
      framesCount,
      framesEncoded: Math.floor(framesCount / BATCH_SIZE) * BATCH_SIZE,
      timeSpent,
      timeLeft: fps !== -1 ? (fileInfo.length * 60 - framesCount) / fps : -1,
      percentageDone: (framesCount / (fileInfo.length * 60)) * 100,
      fps,
      fpsAverage: framesCount / timeSpent,
    };
  };

  return {
    start,
    addFrame,
    endEncoding,
    getStats,
  };
};

export default useEncoder;
