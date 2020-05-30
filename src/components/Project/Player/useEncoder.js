import { useState, useEffect } from 'react';
import useFFmpeg from './useFFmpeg';
import { downloadBlob } from '../../../utils/downloadUtils';

const BATCH_SIZE = 60;

function useEncoder() {
  const { ffmpeg, error } = useFFmpeg(null);
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
  let outputVideo = null;
  let previousFrameVideo = null;
  let startTime = null;
  let encodeBatchStart = null;
  let fps = 0;

  const start = (fInfo) => {
    fileInfo = fInfo;
    framesCount = 0;
    outputVideo = null;
    previousFrameVideo = null;
    startTime = Date.now();

    updateBatchStats();
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

      const result = ffmpeg({
        MEMFS: memfs,
        // prettier-ignore
        arguments: [
          '-framerate', '60', "-start_number", (framesCount - memfs.length).toFixed(0), '-i', "img%5d.png", 
          '-c:v', 'libvpx', '-qmin', '0', '-qmax','50', "-crf", '4', '-b:v', '2M', '-c:a', 'libvorbis', 'frame.webm'
       ]
      });

      if (outputVideo === null) {
        outputVideo = result.MEMFS[0].data;
      } else {
        previousFrameVideo = result.MEMFS[0].data;

        // concatenate each frame into output video
        const listData = new TextEncoder().encode(
          "file 'out.webm'\nfile 'frame.webm'"
        );
        const concat = ffmpeg({
          MEMFS: [
            { name: 'list.txt', data: listData },
            { name: 'out.webm', data: outputVideo },
            { name: 'frame.webm', data: previousFrameVideo },
          ],
          // prettier-ignore
          arguments: ['-f', 'concat', '-i', 'list.txt', '-c', 'copy',  'out2.webm']
        });

        outputVideo = concat.MEMFS[0].data;
      }

      updateBatchStats();
    }

    framesCount++;
    return Boolean(imageName);
  };

  const updateBatchStats = () => {
    fps =
      encodeBatchStart === null
        ? -1
        : BATCH_SIZE / ((Date.now() - encodeBatchStart) / 1000);
    encodeBatchStart = Date.now();
  };

  const downloadVideo = (name) => {
    downloadBlob(outputVideo, name, 'video/webm');
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

  const getOutputInfo = () => {
    return {
      duration: Math.floor(framesCount / 60),
      size: outputVideo.length,
    };
  };

  return {
    start,
    addFrame,
    downloadVideo,
    getOutputInfo,
    getStats,
  };
};

export default useEncoder;
