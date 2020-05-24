import { useState, useEffect } from 'react';
import useFFmpeg from './useFFmpeg';
import { downloadBlob } from '../../../utils/downloadUtils';

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
  let framesCount = 0;
  let outputVideo = null;
  let previousFrameVideo = null;

  const start = () => {
    framesCount = 0;
    outputVideo = null;
    previousFrameVideo = null;
  };

  const addFrame = (imageName, FS) => {
    if (imageName === null || (framesCount !== 0 && framesCount % 5 === 0)) {
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
        arguments: ['-framerate', '60', "-start_number", (framesCount - memfs.length).toFixed(0), '-i', "img%5d.png", 'frame.webm']
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
    }

    framesCount++;
    return Boolean(imageName);
  };

  const downloadVideo = (name) => {
    downloadBlob(outputVideo, name, 'video/webm');
  };

  const getFramesCount = () => {
    return framesCount;
  };

  const getOutputInfo = () => {
    return {
      duration: Math.floor(framesCount / 60),
      size: outputVideo.length,
    };
  };

  return { start, addFrame, downloadVideo, getOutputInfo, getFramesCount };
};

export default useEncoder;
