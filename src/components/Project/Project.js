import React, { useState, useEffect } from 'react';
import { makeStyles, Typography, Fab, Grid, Box } from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import AddIcon from '@material-ui/icons/Add';
import Player from './Player';
import firebase from 'firebase';
import DocumentTitle from 'react-document-title';
import Style from './Style';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
  contentRoot: {
    paddingTop: 75,
    padding: theme.spacing(2),
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

const Project = ({ history }) => {
  const [error, setError] = useState('');
  const [file, setFile] = useState();
  const classes = useStyles();
  const [style, setStyle] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    if (!file) history.push('/new');
    else history.push('/player');
  }, [file, history]);

  const handleFileChange = (e) => {
    if (e.target.files.length === 1) {
      if (!e.target.files[0].name.toLowerCase().endsWith('.mid')) {
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
      <DocumentTitle
        title={(file ? 'Your Story' : 'New Story') + ' – Midistory'}
      />
      {file ? (
        <div>
          <Grid container spacing={3}>
            <Grid item xs>
              <Box mt={3}>
                <Player
                  fileURL={file.url}
                  name={file.name}
                  onClose={clearFile}
                  onFileLoaded={setFileInfo}
                  style={style}
                />
              </Box>
            </Grid>
            <Grid item>
              <Style onChange={setStyle} fileInfo={fileInfo} />
            </Grid>
          </Grid>
        </div>
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
              Select a midi file to start your project
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
