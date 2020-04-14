import React from 'react';
import Unity, { UnityContent } from 'react-unity-webgl';
import {
  Paper,
  withStyles,
  CircularProgress,
  Typography,
  IconButton,
  Grid,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
      this.unityContent.send('Sheet', 'ReceiveImage', props.fileURL);
    });
  }
  state = {
    unityLoaded: false,
  };

  render() {
    const { classes, name, onClose } = this.props;
    return (
      <div>
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
        </Paper>
        <Grid
          container
          wrap="nowrap"
          className={classes.caption}
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h6" noWrap>
              {name}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton edge="end" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  hidden: {
    visibility: 'hidden',
  },
  paper: {
    //16:9 aspect ration
    paddingTop: '56.25%',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
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
});

export default withStyles(styles)(Player);
