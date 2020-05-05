import React from 'react';
import MobileOffIcon from '@material-ui/icons/MobileOff';
import { Paper, Box, Grid, Typography } from '@material-ui/core';

const UnsupportedMobile = () => {
  return (
    <Paper variant="outlined" style={{ display: 'inline-block' }}>
      <Box p={2}>
        <Grid container spacing={1}>
          <Grid item>
            <MobileOffIcon color="error" />
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1" color="error">
              Mobile Browser Detected
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Midistory is using rendering technology not yet available on
              mobile browsers.
              <br />
              Please return on a <u>desktop browser</u>.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default UnsupportedMobile;
