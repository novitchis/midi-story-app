import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  ButtonBase,
  Popover,
  makeStyles,
} from '@material-ui/core';
import { TwitterPicker } from 'react-color';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    height: 400,
    padding: theme.spacing(3),
  },
  colorRect: {
    display: 'inline-block',
    borderRadius: 2,
    height: 20,
    width: 40,
  },
}));

const Style = ({ onChange }) => {
  const classes = useStyles();

  const [style, setStyle] = useState({
    color: '#00bef9',
  });

  useEffect(() => {
    onChange(style);
  }, [style, onChange]);

  return (
    <Paper className={classes.root} square>
      <Grid container spacing={2} alignItems="center" direction="row">
        <Grid item>
          <Typography>All Tracks</Typography>
        </Grid>
        <Grid item xs>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <>
                <ButtonBase {...bindTrigger(popupState)}>
                  <span
                    className={classes.colorRect}
                    style={{
                      background: style.color,
                    }}
                  ></span>
                </ButtonBase>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <TwitterPicker
                    onChange={(color) => {
                      setStyle({ ...style, color: color.hex });
                      popupState.close();
                    }}
                  />
                </Popover>
              </>
            )}
          </PopupState>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Style;
