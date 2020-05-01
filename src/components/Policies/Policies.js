import React from 'react';
import { Tabs, Tab, Paper, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import AppBar from '../AppBar';
import Privacy from './Privacy';
import Terms from './Terms';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 64,
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
    </div>
  );
};

export default PrivacyPolicy;
