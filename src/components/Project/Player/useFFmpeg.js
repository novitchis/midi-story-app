import { useState, useEffect } from 'react';

function useFFmpeg() {
  const [ffmpegAsync, setFFmpegAsync] = useState(null);

  useEffect(() => {
    // TODO: this is not optimal should investigate why using npm results in out of memory exception
    // Load ffmpeg.js lib from unpkg
    // This is a workarround to use Commonjs build in browser;
    window.module = {};

    const script = document.createElement('script');
    script.async = true;
    script.onerror = (error) => {
      setFFmpegAsync({
        error:
          'Could not load encoder script. Please try again in a few minutes.',
      });
      delete window.module;
    };
    script.onload = () => {
      setFFmpegAsync({ ffmpeg: window.module.exports });
      delete window.module;
    };
    document.body.appendChild(script);
    script.src = 'https://unpkg.com/ffmpeg.js@4.2.9003/ffmpeg-webm.js';

    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...ffmpegAsync };
}

export default useFFmpeg;
