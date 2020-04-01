import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./firebaseConfig";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <span style={{ color: "lightgreen" }}>midi</span>
          <span style={{ color: "lightblue" }}>story</span>
        </p>
      </header>
    </div>
  );
}

export default App;
