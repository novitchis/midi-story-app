import React, { useState, useEffect } from 'react';
import { Typography, Grid, makeStyles, Tooltip } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import ColorPicker from './ColorPicker';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 240,
    position: 'relative',
  },
  multiColorToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  multiColorRect: {
    display: 'inline-block',
    borderRadius: 2,
    height: 20,
    width: 8,
    margin: 2,
  },
  divider: {
    marginTop: 160,
    width: '100%',
  },
}));

const Style = ({ onChange, fileInfo }) => {
  const classes = useStyles();

  const [tracks, setTracks] = useState([
    {
      color: '#00bef9',
    },
  ]);

  const [isMultiColors, setIsMultiColor] = useState(false);

  useEffect(() => {
    onChange({ tracks });
  }, [tracks, onChange]);

  const setTrackColor = (index, color) => {
    setTracks(
      tracks.map((track, currentTrackIndex) => {
        if (currentTrackIndex === index) return { ...track, color };

        return track;
      })
    );
  };

  const handelMultiTrackToggle = () => {
    if (fileInfo) {
      setIsMultiColor(!isMultiColors);

      if (isMultiColors) setTracks([tracks[0]]);
      else setTracks(fileInfo.tracks.map((track) => ({ ...tracks[0] })));
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center" direction="row">
        {!isMultiColors ? (
          <>
            <Grid item>
              <Typography>All Tracks</Typography>
            </Grid>
            <Grid item xs>
              <ColorPicker
                value={tracks[0].color}
                onChange={(color) => setTrackColor(0, color)}
              />
            </Grid>
          </>
        ) : (
          <>
            {fileInfo &&
              fileInfo.tracks.map((track, index) => {
                if (!track.hasNotes) return null;

                return (
                  <React.Fragment key={index}>
                    <Grid item>{track.name}</Grid>
                    <Grid item xs={7}>
                      <ColorPicker
                        value={tracks[index].color}
                        onChange={(color) => setTrackColor(index, color)}
                      />
                    </Grid>
                  </React.Fragment>
                );
              })}
          </>
        )}
      </Grid>
      <Tooltip title="Use diferent colors for each track">
        <ToggleButton
          className={classes.multiColorToggle}
          size="small"
          value="multiColors"
          selected={isMultiColors}
          onChange={handelMultiTrackToggle}
        >
          <span
            className={classes.multiColorRect}
            style={{
              background: '#ffe082',
            }}
          ></span>
          <span
            className={classes.multiColorRect}
            style={{
              background: '#90caf9',
            }}
          ></span>
        </ToggleButton>
      </Tooltip>
    </div>
  );
};

export default Style;
