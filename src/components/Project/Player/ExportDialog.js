import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  ButtonGroup,
  Grid,
  makeStyles,
  IconButton,
  LinearProgress,
} from '@material-ui/core';
import useEncoder from './useEncoder';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    padding: theme.spacing(2, 3),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  selectedButton: {
    background: theme.palette.secondary[900],
  },
  alignRight: {
    textAlign: 'right',
  },
}));

const ExportDialog = ({ onClose, open, unityContent }) => {
  const classes = useStyles();
  const [isExporting, setIsExporting] = useState(false);
  const { encoder, error } = useEncoder();

  useEffect(() => {
    if (!encoder) return;

    if (isExporting) {
      unityContent.send('Main Camera', 'StartCapturing');

      // TODO: how to remove this event?
      unityContent.on('ImageCaptured', (args) => {
        encoder.addFrame(...args);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoder, isExporting]);

  const handleExportClick = () => {
    if (!isExporting) {
      setIsExporting(true);
    } else {
      setIsExporting(false);
      unityContent.send('Main Camera', 'StopCapturing');
      encoder.downloadVideo();
    }
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      open={open}
      disableBackdropClick
    >
      <DialogTitle id="export-dialog-title">Export Video</DialogTitle>
      <IconButton
        className={classes.closeButton}
        onClick={onClose}
        disabled={isExporting}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className={classes.root}>
        <Grid container direction="column" spacing={3}>
          <Grid item container alignItems="center">
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                Quality
              </Typography>
            </Grid>
            <Grid item>
              <ButtonGroup color="secondary" aria-label="quality">
                <Button className={classes.selectedButton}>720p</Button>
                <Button disabled>1080p</Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid item container alignItems="center">
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                Format
              </Typography>
            </Grid>
            <Grid item>
              <Typography>WebM</Typography>
            </Grid>
          </Grid>
          {!isExporting ? (
            <Grid item container alignItems="center" spacing={1}>
              <Grid item>
                <InfoIcon />
              </Grid>
              <Grid item xs>
                <Typography variant="body2">
                  This operation may take around 1 hour. Please don't close your
                  browser.
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Exporting
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    color="secondary"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2">1 fps</Typography>
                </Grid>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2">2:40 / 5:50</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {error && (
            <Grid item>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button onClick={handleExportClick} variant="contained" color="primary">
          {isExporting ? 'Cancel Export' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
