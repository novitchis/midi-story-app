import React from 'react';
import { makeStyles, Typography, Button, Grid } from '@material-ui/core';
import ExploreOffIcon from '@material-ui/icons/ExploreOff';

const useStyles = makeStyles((theme) => ({
  contentRoot: {
    paddingTop: 180,
    padding: theme.spacing(3),
  },
  centerContent: {
    textAlign: 'center',
  },
  icon: {
    fontSize: 256,
  },
}));

const PageNotFound = ({ history }) => {
  const classes = useStyles();

  return (
    <div className={classes.contentRoot}>
      <Grid
        container
        direction="column"
        spacing={4}
        className={classes.centerContent}
      >
        <Grid item>
          <ExploreOffIcon className={classes.icon} color="disabled" />
        </Grid>
        <Grid item>
          <Typography variant="h5">
            The page you are looking for doesn't exist.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="large"
            onClick={() => history.push('/')}
          >
            Take me home
          </Button>
        </Grid>
      </Grid>
      )}
    </div>
  );
};

export default PageNotFound;
