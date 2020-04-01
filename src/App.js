import React from "react";
import "./App.css";
import "./firebaseConfig";
import Player from "./components/Player";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Player />
        <p>
          <span style={{ color: "lightgreen" }}>midi</span>
          <span style={{ color: "lightblue" }}>story</span>
        </p>
      </header>
    </div>
  );
}

export default App;
