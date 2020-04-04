import React from "react";
import Unity, { UnityContent } from "react-unity-webgl";

class Player extends React.Component {
  constructor(props) {
    super(props);

    // Next up create a new Unity Content object to
    // initialise and define your WebGL build. The
    // paths are relative from your index html file.

    this.unityContent = new UnityContent(
      "Player/Build.json",
      "Player/UnityLoader.js"
    );
  }

  render() {
    // Finally render the Unity component and pass
    // the Unity content through the props.

    return <Unity unityContent={this.unityContent} />;
  }
}

export default Player;
