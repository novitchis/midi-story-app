import React from 'react';
import { Paper, Typography, Button, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import useLocalStorage from '../../utils/useLocalStorage';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    padding: 20,
  },
  buttonPanel: {
    textAlign: 'right',
  },
});

const CookiesBanner = () => {
  const classes = useStyles();
  const [cookiesConsent, setCookiesConsent] = useLocalStorage(
    'cookiesConsent',
    false
  );

  if (cookiesConsent) return null;

  return (
    <Paper elevation={2} className={classes.root}>
      <Typography variant="subtitle1"> This website uses cookies.</Typography>
      <Typography variant="body2" gutterBottom>
        We use cookies to improve user experience. <br /> By clicking or
        navigating the site, you agree <br /> to our{' '}
        <RouterLink to="/policies/cookies">
          <Typography variant="body2" color="secondary" component="span">
            Cookie Policy
          </Typography>
        </RouterLink>
        .
      </Typography>
      <div className={classes.buttonPanel}>
        <Button
          variant="outlined"
          onClick={() => {
            setCookiesConsent(true);
          }}
        >
          Got it
        </Button>
      </div>
    </Paper>
  );
};

export default CookiesBanner;
