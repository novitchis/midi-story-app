import React, { useState, useEffect } from 'react';
import {
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
    width: 240,
  },
  colorRect: {
    display: 'inline-block',
    borderRadius: 2,
    height: 20,
    width: 40,
  },
  divider: {
    marginTop: 160,
    width: '100%',
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
    <div className={classes.root}>
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
                    colors={[
                      '#ef9a9a',
                      '#f48fb1',
                      '#ce93d8',
                      '#b39ddb',
                      '#9fa8da',
                      '#00bef9',
                      '#90caf9',
                      '#81d4fa',
                      '#80deea',
                      '#80cbc4',
                      '#a5d6a7',
                      '#c5e1a5',
                      '#e6ee9c',
                      '#fff59d',
                      '#ffe082',
                      '#ffcc80',
                      '#ffab91',
                      '#bcaaa4',
                      '#ffffff',
                      '#eeeeee',
                      '#b0bec5',
                    ]}
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
        {/* <Divider className={classes.divider} /> */}
      </Grid>
    </div>
  );
};

export default Style;
