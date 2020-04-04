import React, { useState, useEffect } from "react";
import "./App.css";
import "./firebaseConfig";
import firebase from "firebase";
import UnauthenticatedApp from "./UnauthenticatedApp";
import AuthenticatedApp from "./AuthenticatedApp";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

function App() {
  const [isSignedIn, setIsSignedId] = useState();

  useEffect(() => {
    var unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => setIsSignedId(Boolean(user)));

    return unregisterAuthObserver;
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={createMuiTheme(theme)}>
        {isSignedIn ? (
          <AuthenticatedApp />
        ) : (
          <UnauthenticatedApp isLoading={isSignedIn === undefined} />
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
