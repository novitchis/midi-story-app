import { useState, useEffect } from 'react';
// import useFFmpeg from './useFFmpeg';
import useFFmpegWorker from './useFFmpegWorker';

const CHUNK_SIZE = 60;

function useEncoder() {
  const worker1 = useFFmpegWorker(null);
  const worker2 = useFFmpegWorker(null);

  const [encoder, setEncoder] = useState(null);

  useEffect(() => {
    if (!worker1.ffmpeg || !worker2.ffmpeg || encoder !== null) return;
    setEncoder(getEncoder([worker1, worker2]));
  }, [worker1, worker2, encoder]);

  if (worker1.ffmpeg === null || worker2.ffmpeg === null)
    return { encoder: null, error: worker1.error || worker2.error };

  return { encoder };
}

const getEncoder = (workers) => {
  const workersPool = [...workers];

  let fileInfo = null;
  let framesCount = 0;
  let startTime = null;
  let fps = -1;

  let chunks = null;
  let encodedChunksCount = 0;

  let outputChunks = null;

  const start = (fInfo) => {
    fileInfo = fInfo;
    fps = -1;
    framesCount = 0;
    encodedChunksCount = 0;
    startTime = Date.now();
    chunks = [];
    outputChunks = [];
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

      addEncodingWork({
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

  const addEncodingWork = (chunk) => {
    chunks.push(chunk);
    encodeNextChunk();
  };

  const encodeNextChunk = () => {
    if (chunks.length === 0 || workersPool.length === 0) return;

    const worker = workersPool.pop();
    const chunk = chunks.shift();
    const chunkIndex = encodedChunksCount++;

    const encodeBatchStart = Date.now();

    worker
      .ffmpeg(chunk)
      .then((result) => {
        outputChunks[chunkIndex] = result.MEMFS[0].data;
        fps =
          (chunk.MEMFS.length / ((Date.now() - encodeBatchStart) / 1000)) * 2;

        workersPool.push(worker);
        encodeNextChunk();
      })
      .catch(() => {
        workersPool.push(worker);
      });
  };

  const endEncoding = () => {
    return new Promise((resolve, reject) => {
      const awaitWorkersFinish = () => {
        setTimeout(() => {
          if (chunks.length === 0 && workersPool.length === workers.length) {
            concatChunks(workersPool.pop())
              .then((result) => {
                outputChunks = [];
                resolve({
                  duration: Math.floor(framesCount / 60),
                  data: result.MEMFS[0].data,
                });
              })
              .catch(reject);
          } else {
            awaitWorkersFinish();
          }
        }, 5000);
      };
      awaitWorkersFinish();
    });
  };

  const concatChunks = (worker) => {
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

    return worker.ffmpeg({
      MEMFS: memfs,
      // prettier-ignore
      arguments: ['-f', 'concat', '-i', 'list.txt', '-c', 'copy',  'output.webm']
    });
  };

  const cancel = () => {
    chunks = [];
    const busyWorkers = workers.filter(
      (worker) => !workersPool.includes(worker)
    );
    busyWorkers.forEach((worker) => worker.resetWork());
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
