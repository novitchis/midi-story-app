import React from 'react';
import Unity, { UnityContent } from 'react-unity-webgl';
import {
  Paper,
  withStyles,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Grid,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import ReplayIcon from '@material-ui/icons/Replay';
import DownloadIcon from '@material-ui/icons/GetApp';
// import SettingsIcon from '@material-ui/icons/Settings';
import cx from 'class-names';
import ExportDialog from './ExportDialog';

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

    this.unityContent.on('FileLoaded', (fileInfo) => {
      this.setState({ fileInfo });
    });

    this.unityContent.on('Finished', () => {
      this.setState({ playback: 'finished' });
    });
  }
  state = {
    unityLoaded: false,
    fileInfo: false,
    playback: 'stopped',
    export: false,
  };

  componentWillUnmount = () => {
    this.unityContent.remove();
  };

  isPlaying = () => {
    return this.state.playback === 'playing';
  };

  handleSkipClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.unityContent.send('Sheet', 'GoToStart');
    this.setState((state) => ({
      playback: 'playing',
    }));
  };

  handlePlayPauseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.unityContent.send('Sheet', this.isPlaying() ? 'Pause' : 'Play');

    this.setState((state) => ({
      playback: state.playback === 'playing' ? 'paused' : 'playing',
    }));
  };

  handleExportVideoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.isPlaying()) this.handlePlayPauseClick(e);

    this.setState({ export: true });
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
            <div className={classes.center}>
              <CircularProgress />
            </div>
          )}
          {this.state.fileInfo && (
            <div
              className={cx(
                classes.overlay,
                !this.isPlaying() && classes.overlayVisible
              )}
              onClick={this.handlePlayPauseClick}
            >
              {this.state.playback === 'finished' ? (
                <div className={classes.center}>
                  <Tooltip title="Replay">
                    <IconButton onClick={this.handleSkipClick}>
                      <ReplayIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                <>
                  {this.state.playback === 'stopped' && (
                    <div className={classes.center}>
                      <Tooltip title="Play">
                        <IconButton
                          onClick={this.handlePlayPauseClick}
                          color="primary"
                        >
                          <PlayIcon className={classes.largePlayIcon} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                  <div className={classes.playbackRoot}>
                    <Grid container>
                      {this.state.playback !== 'stopped' && (
                        <>
                          <Grid item>
                            <Tooltip title="Restart">
                              <IconButton
                                size="small"
                                onClick={this.handleSkipClick}
                                disableRipple
                                className={classes.overlayIconButton}
                              >
                                <SkipPreviousIcon
                                  className={classes.overlayIcon}
                                />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item>
                            <Tooltip
                              title={this.isPlaying() ? 'Pause' : 'Play'}
                            >
                              <IconButton
                                size="small"
                                onClick={this.handlePlayPauseClick}
                                disableRipple
                                className={classes.overlayIconButton}
                              >
                                {this.isPlaying() ? (
                                  <PauseIcon className={classes.overlayIcon} />
                                ) : (
                                  <PlayIcon className={classes.overlayIcon} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </>
                      )}
                      <Grid item xs />
                      <Grid item>
                        <Tooltip
                          title="Export Video"
                          className={classes.settings}
                        >
                          <IconButton
                            size="small"
                            disableRipple
                            onClick={this.handleExportVideoClick}
                            className={classes.overlayIconButton}
                          >
                            <DownloadIcon className={classes.overlayIcon} />{' '}
                            <Typography variant="button">Video</Typography>
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </div>
                </>
              )}
              <Tooltip title="Close">
                <IconButton
                  onClick={onClose}
                  className={classes.close}
                  disableRipple
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </Paper>
        <Typography variant="h6" noWrap className={classes.caption}>
          {name}
        </Typography>
        {this.state.export && (
          <ExportDialog
            fileName={name}
            onClose={() => this.setState({ export: false })}
            unityContent={this.unityContent}
            open={this.state.export}
            fileInfo={this.state.fileInfo}
          />
        )}
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
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    // visualy looks like it is note centered since the keyboard is offsetted
    // offset the position to look more centered
    bottom: 8,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    marginTop: theme.spacing(1),
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  largePlayIcon: {
    fontSize: 64,
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
      'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.3))',
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
    right: theme.spacing(1),
    bottom: theme.spacing(1),
  },
});

export default withStyles(styles)(Player);
