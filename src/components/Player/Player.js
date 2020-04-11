import React from 'react';
import Unity, { UnityContent } from 'react-unity-webgl';
import { Paper, withStyles, CircularProgress } from '@material-ui/core';

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
    const { classes } = this.props;
    return (
      <Paper elevation={1} className={classes.paper}>
        <div
          className={
            classes.player +
            ' ' +
            (this.state.unityLoaded ? '' : classes.hidden)
          }
        >
          <Unity unityContent={this.unityContent} />
        </div>
        {!this.state.unityLoaded && (
          <CircularProgress className={classes.progress} />
        )}
      </Paper>
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
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  progress: {
    top: '40%',
    position: 'absolute',
  },
});

export default withStyles(styles)(Player);
