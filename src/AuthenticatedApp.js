import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import AppBarComponent from './components/AppBar';
import {
  makeStyles,
  Typography,
  Fab,
  Grid,
  Box,
  IconButton,
} from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  contentRoot: {
    marginTop: 100,
    padding: 20,
    textAlign: 'center',
  },
  icon: {
    fontSize: 256,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const AuthenticatedApp = () => {
  const [error, setError] = useState('');
  const [fileURL, setFileURL] = useState();
  const classes = useStyles();

  const handleFileChange = (e) => {
    if (e.target.files.length === 1) {
      if (!e.target.files[0].name.endsWith('.mid')) {
        setError('Invalid file type. Please select a .mid file.');
      } else {
        setError('');
        if (fileURL) window.URL.revokeObjectURL(fileURL);

        setFileURL(window.URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const clearFile = () => {
    window.URL.revokeObjectURL(fileURL);
    setFileURL(null);
  };

  useEffect(() => {
    // every file url needs to be revoked
    return () => {
      if (fileURL) window.URL.revokeObjectURL(fileURL);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AppBarComponent />
      <div className={classes.contentRoot}>
        {fileURL ? (
          <Box mx={4} textAlign="right">
            <IconButton onClick={clearFile}>
              <CloseIcon />
            </IconButton>
            <Player fileURL={fileURL} />
          </Box>
        ) : (
          <Grid container direction="column" spacing={4}>
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
    </div>
  );
};

export default AuthenticatedApp;
