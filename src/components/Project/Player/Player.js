import React from 'react';
import Unity, { UnityContent } from 'react-unity-webgl';
import {
  Paper,
  withStyles,
  CircularProgress,
  Typography,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import cx from 'class-names';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.unityContent = new UnityContent(
      'Player/Build.json',
      'Player/UnityLoader.js'
    );

    this.unityContent.on('loaded', () => {
      this.setState({ unityLoaded: true });
      this.unityContent.send('Sheet', 'ReceiveFile', props.fileURL);
    });
  }
  state = {
    unityLoaded: false,
    isPlaying: false,
  };

  handleSkipClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.unityContent.send('Sheet', 'GoToStart');
    this.setState((state) => ({
      isPlaying: !state.isPlaying,
    }));
  };

  handlePlayPauseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.unityContent.send('Sheet', this.state.isPlaying ? 'Pause' : 'Play');

    this.setState((state) => ({
      isPlaying: !state.isPlaying,
    }));
  };

  render() {
    const { classes, name, onClose } = this.props;
    return (
      <div className={classes.root}>
        <Paper elevation={1} className={classes.paper}>
          <div
            className={cx(
              classes.player,
              !this.state.unityLoaded && classes.hidden
            )}
          >
            <Unity unityContent={this.unityContent} />
          </div>
          {!this.state.unityLoaded && (
            <CircularProgress className={classes.progress} />
          )}
          {this.state.unityLoaded && (
            <div
              className={cx(
                classes.overlay,
                !this.state.isPlaying && classes.overlayVisible
              )}
              onClick={this.handlePlayPauseClick}
            >
              <IconButton
                onClick={onClose}
                className={cx(classes.overlayIconButton, classes.close)}
                disableRipple
              >
                <CloseIcon className={classes.overlayIcon} />
              </IconButton>
              <div className={classes.playbackRoot}>
                <IconButton
                  size="small"
                  onClick={this.handleSkipClick}
                  disableRipple
                  className={classes.overlayIconButton}
                >
                  <SkipPreviousIcon className={classes.overlayIcon} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={this.handlePlayPauseClick}
                  disableRipple
                  className={classes.overlayIconButton}
                >
                  {this.state.isPlaying ? (
                    <PauseIcon className={classes.overlayIcon} />
                  ) : (
                    <PlayIcon className={classes.overlayIcon} />
                  )}
                </IconButton>
              </div>
            </div>
          )}
        </Paper>
        <Typography variant="h6" noWrap className={classes.caption}>
          {name}
        </Typography>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    maxWidth: 1280,
    position: 'relative',
    margin: 'auto',
  },
  hidden: {
    visibility: 'hidden',
  },
  paper: {
    //16:9 aspect ration
    paddingTop: '56.25%',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
    '&:hover': {
      '& $overlay': {
        display: 'block',
      },
    },
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  progress: {
    top: '45%',
    position: 'absolute',
  },
  caption: {
    marginTop: theme.spacing(1),
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  overlayIconButton: {
    '&:hover': {
      background: 'none',
    },
  },
  overlayIcon: {
    fontSize: 28,
  },
  overlay: {
    background:
      'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.2))',
    display: 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  overlayVisible: {
    display: 'block',
  },
  playbackRoot: {
    position: 'absolute',
    left: theme.spacing(1),
    bottom: theme.spacing(1),
  },
});

export default withStyles(styles)(Player);
