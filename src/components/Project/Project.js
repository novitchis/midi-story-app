import React, { useState, useEffect } from 'react';
import { makeStyles, Typography, Fab, Grid } from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import AddIcon from '@material-ui/icons/Add';
import Player from './Player';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  contentRoot: {
    paddingTop: 180,
    padding: theme.spacing(3),
  },
  centerContent: {
    textAlign: 'center',
  },
  icon: {
    fontSize: 256,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Project = () => {
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const classes = useStyles();

  const handleFileChange = (e) => {
    if (e.target.files.length === 1) {
      if (!e.target.files[0].name.endsWith('.mid')) {
        setError('Invalid file type. Please select a .mid file.');
      } else {
        setError('');
        if (file) window.URL.revokeObjectURL(file.url);

        setFile({
          name: e.target.files[0].name.substring(
            0,
            e.target.files[0].name.length - 4
          ),
          url: window.URL.createObjectURL(e.target.files[0]),
        });
        firebase.analytics().logEvent('file_selected', {
          name: e.target.files[0].name,
          size: e.target.files[0].size,
        });
      }
    }
  };

  const clearFile = () => {
    if (file) window.URL.revokeObjectURL(file.url);
    setFile(null);
  };

  useEffect(() => {
    // every file url needs to be revoked
    return () => {
      if (file) window.URL.revokeObjectURL(file.url);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.contentRoot}>
      {file ? (
        <Player fileURL={file.url} name={file.name} onClose={clearFile} />
      ) : (
        <Grid
          container
          direction="column"
          spacing={4}
          className={classes.centerContent}
        >
          <Grid item>
            <AlbumIcon className={classes.icon} color="disabled" />
          </Grid>
          <Grid item>
            <Typography variant="h5">
              Select your midi file to start your project
            </Typography>
          </Grid>
          <Grid item>
            <input
              accept=".mid"
              className={classes.input}
              id="midi-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="midi-file">
              <Fab
                variant="extended"
                color="primary"
                component="span"
                size="large"
              >
                <AddIcon className={classes.extendedIcon} />
                Create
              </Fab>
            </label>
          </Grid>
          {error && (
            <Grid>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
};

export default Project;
