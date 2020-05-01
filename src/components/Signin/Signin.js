import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 320,
  },
  label: {
    marginTop: theme.spacing(2),
  },
  gridItem: {
    marginLeft: theme.spacing(3),
  },
}));

const Signin = () => {
  const classes = useStyles();
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  };

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.gridItem}>
        <Typography variant="h6" className={classes.label}>
          Get access
        </Typography>
      </Grid>
      <Grid item>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
          className={classes.authPanel}
        />
      </Grid>
      <Grid item className={classes.gridItem}>
        <Typography variant="caption">
          By continuing, you agree to our{' '}
          <RouterLink to="/policies/privacy">
            <Typography variant="caption" color="secondary">
              privacy policy
            </Typography>
          </RouterLink>
          {' and '}
          <RouterLink to="/policies/terms">
            <Typography variant="caption" color="secondary">
              terms of service
            </Typography>
          </RouterLink>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Signin;
