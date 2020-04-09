import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Divider,
  makeStyles,
} from '@material-ui/core';
import Signin from './components/Signin';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';

const useStyles = makeStyles((theme) => ({
  rootWrapper: {
    padding: 20,
  },
  contentRoot: {
    paddingTop: '20%',
  },
  mainTitle: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    marginLeft: theme.spacing(6),
  },
  playIcon: {
    verticalAlign: 'center',
  },
}));

const UnauthenticatedApp = ({ isLoading }) => {
  const classes = useStyles();

  return (
    <div className={classes.rootWrapper}>
      {!isLoading && (
        <Container maxWidth="lg">
          <Grid className={classes.contentRoot} container spacing={2}>
            <Grid item xs={8}>
              <Typography
                className={classes.mainTitle}
                variant="h3"
                gutterBottom
              >
                {'Welcome to '}
                <Typography variant="h3" color="primary" component="span">
                  Midistory
                </Typography>
              </Typography>
              <Grid container alignItems="center" spacing={2} wrap="nowrap">
                <Grid item>
                  <PlayCircleFilledIcon
                    color="primary"
                    fontSize="large"
                    className={classes.playIcon}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5">
                    {'Create beautiful '}
                    <Typography variant="h5" color="primary" component="span">
                      videos
                    </Typography>
                    {' from your midi files.'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item>
              <Signin />
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default UnauthenticatedApp;
