import React from 'react';
import Unity, { UnityContent } from 'react-unity-webgl';
import { Paper, withStyles } from '@material-ui/core';

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
    console.log(this.props.classes);
    return (
      <Paper elevation={1}>
        <div
          className={this.state.unityLoaded ? '' : this.props.classes.hidden}
        >
          <Unity unityContent={this.unityContent} />
        </div>
      </Paper>
    );
  }
}

const styles = (theme) => ({
  hidden: {
    visibility: 'hidden',
  },
});

export default withStyles(styles)(Player);
