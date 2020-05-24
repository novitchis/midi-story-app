import { useState, useEffect } from 'react';
import useFFmpeg from './useFFmpeg';
import { downloadBlob } from '../../../utils/downloadUtils';

function useEncoder() {
  const { ffmpeg, error } = useFFmpeg(null);
  const [encoder, setEncoder] = useState(null);
  // const [frames, setFrames] = useState(0);

  // useEffect(() => {
  //   setInterval(() => {
  //     setFrames(framesCount);
  //   }, 5000);
  // }, []);
  useEffect(() => {
    if (!ffmpeg) return;
    setEncoder(getEncoder(ffmpeg));
  }, [ffmpeg]);

  if (ffmpeg === null) return { encoder: null, error };

  return { encoder };
}

const getEncoder = (ffmpeg) => {
  let framesCount = 0;
  let currentFrame = null;
  let previousFrame = null;
  let outputVideo = null;
  let previousFrameVideo = null;

  const addFrame = (imageName, FS) => {
    previousFrame = currentFrame;
    currentFrame = imageName;

    if (previousFrame) {
      // create a video from each frame
      const previousFile = {
        name: previousFrame.substring(previousFrame.lastIndexOf('/') + 1),
        data: FS.readFile(previousFrame, { encoding: 'binary' }),
      };
      const result = ffmpeg({
        MEMFS: [previousFile],
        // prettier-ignore
        arguments: ['-framerate', '60', '-i', previousFile.name, 'frame.webm']
      });

      if (framesCount === 0) {
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

      framesCount++;
      console.log(framesCount);
    }
  };

  const downloadVideo = () => {
    downloadBlob(outputVideo, 'video.webm', 'video/webm');
  };

  const getFramesCount = () => {
    return framesCount;
  };

  return { addFrame, downloadVideo, getFramesCount };
};

export default useEncoder;
