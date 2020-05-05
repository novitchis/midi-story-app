import React from 'react';
import { Tabs, Tab, Paper, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import AppBar from '../AppBar';
import Privacy from './Privacy';
import Terms from './Terms';
import Cookies from './Cookies';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 64,
    '& p': {
      color: theme.palette.text.secondary,
    },
    '& li': {
      color: theme.palette.text.secondary,
    },
    '& a': {
      color: theme.palette.secondary.main,
    },
  },
  tabPanel: {
    padding: theme.spacing(4),
  },
}));

const PrivacyPolicy = ({ history }) => {
  const { policy = 'privacy' } = useParams();
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    history.push(`/policies/${newValue}`);
  };

  return (
    <div className={classes.root}>
      <AppBar />
      <Tabs
        value={policy}
        onChange={handleChange}
        aria-label="Privacy & terms tabs"
      >
        <Tab
          value="privacy"
          label="Privacy Policy"
          id="tab-0"
          aria-controls="tabpanel-0"
        />
        <Tab
          value="terms"
          label="Terms of Service"
          id="tab-1"
          aria-controls="tabpanel-1"
        />
        <Tab
          value="cookies"
          label="Cookie Policy"
          id="tab-2"
          aria-controls="tabpanel-2"
        />
      </Tabs>
      {policy === 'privacy' && (
        <Paper
          id="tabpanel-0"
          aria-labelledby="tab-0"
          className={classes.tabPanel}
          square
        >
          <Privacy />
        </Paper>
      )}
      {policy === 'terms' && (
        <Paper
          id="tabpanel-1"
          aria-labelledby="tab-1"
          className={classes.tabPanel}
          square
        >
          <Terms />
        </Paper>
      )}
      {policy === 'cookies' && (
        <Paper
          id="tabpanel-2"
          aria-labelledby="tab-2"
          className={classes.tabPanel}
          square
        >
          <Cookies />
        </Paper>
      )}
    </div>
  );
};

export default PrivacyPolicy;
