import React from 'react';
import { ButtonBase, Popover, makeStyles, Tooltip } from '@material-ui/core';
import { TwitterPicker } from 'react-color';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

const allCollors = [
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
  '#eeeeee',
  '#b0bec5',
];

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
  multiColorRect: {
    display: 'inline-block',
    borderRadius: 2,
    height: 20,
    width: 8,
    margin: 2,
  },
  divider: {
    marginTop: 160,
    width: '100%',
  },
}));

const ColorPicker = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <>
          <Tooltip title="Select a color">
            <ButtonBase {...bindTrigger(popupState)}>
              <span
                className={classes.colorRect}
                style={{
                  background: value,
                }}
              ></span>
            </ButtonBase>
          </Tooltip>

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
              colors={allCollors}
              onChange={(color) => {
                onChange(color.hex);
                popupState.close();
              }}
            />
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default ColorPicker;
