import React, { useState, useEffect } from 'react';
import './firebaseConfig';
import firebase from 'firebase';
import UnauthenticatedApp from './UnauthenticatedApp';
import AuthenticatedApp from './AuthenticatedApp';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import theme from './theme';

const useStyles = makeStyles(() => ({
  appRoot: {
    background: theme.palette.background.default,
    color: '#FFFFFF',
    minHeight: '100vh',
  },
}));

function App() {
  const [isSignedIn, setIsSignedId] = useState();
  const classes = useStyles();

  useEffect(() => {
    var unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => setIsSignedId(Boolean(user)));

    return unregisterAuthObserver;
  }, []);

  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <div className={classes.appRoot}>
        {isSignedIn ? (
          <AuthenticatedApp />
        ) : (
          <UnauthenticatedApp isLoading={isSignedIn === undefined} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
