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
  Divider,
} from '@material-ui/core';
import useEncoder from './useEncoder';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import { humanFileSize } from '../../../utils/downloadUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 360,
    overflow: 'hidden',
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

const ExportDialog = ({ onClose, open, unityContent, fileInfo, fileName }) => {
  const classes = useStyles();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFinished, setExportFinished] = useState(false);
  const { encoder, error } = useEncoder();

  const [fps, setFps] = useState(0);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (!encoder || !isExporting) return;
    const frames = encoder.getFramesCount();
    setTimeout(() => {
      setFps((encoder.getFramesCount() - frames) / 3);
      setTicks((ticks) => ticks + 3);
    }, 3000);
  }, [encoder, ticks, isExporting]);

  useEffect(() => {
    if (!encoder) return;

    if (isExporting) {
      setTicks(0);
      unityContent.send('Main Camera', 'StartCapturing');

      // TODO: how to remove this event?
      unityContent.on('ImageCaptured', ([fileName, FS]) => {
        if (!encoder.addFrame(fileName, FS)) {
          setIsExporting(false);
          setExportFinished(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoder, isExporting]);

  const handleExportClick = () => {
    if (!isExporting) {
      encoder.start();
      setIsExporting(true);
    } else {
      setIsExporting(false);
      setExportFinished(true);
      unityContent.send('Main Camera', 'StopCapturing');
    }
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      open={open}
      disableBackdropClick
    >
      <DialogTitle id="export-dialog-title">Create Video</DialogTitle>
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
            <>
              {exportFinished ? (
                <Grid item container alignItems="center" spacing={3}>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Your video was successfully created:
                    </Typography>
                  </Grid>
                  <Grid item container>
                    <Grid item xs>
                      <Typography>{fileName}.webm</Typography>
                    </Grid>

                    <Grid item>
                      <Typography variant="body2">
                        {toMMSS(encoder.getOutputInfo().duration)} •{' '}
                        {humanFileSize(encoder.getOutputInfo().size)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" color="secondary">
                        Created in {(ticks / 60).toFixed(1)} min,{' '}
                        {fps.toFixed(1)} fps average.
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item container alignItems="center" spacing={1}>
                  <Grid item>
                    <InfoIcon />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body2">
                      This operation may take some time. Please don't close your
                      browser.
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <Grid item>
              <Grid container spacing={1}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (encoder.getFramesCount() / (fileInfo.length * 60)) * 100
                    }
                    color="secondary"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2">{fps.toFixed(1)} fps</Typography>
                </Grid>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2">
                    {toMMSS(encoder.getFramesCount() / 60)} /{' '}
                    {toMMSS(fileInfo.length)}
                  </Typography>
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
        {exportFinished ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              encoder.downloadVideo(fileName);
            }}
          >
            <GetAppIcon />
            Save
          </Button>
        ) : (
          <Button
            onClick={handleExportClick}
            variant="contained"
            color="primary"
          >
            {isExporting ? 'Stop' : 'Start'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const toMMSS = function (number) {
  var sec_num = parseInt(number, 10); // don't forget the second param
  var minutes = Math.floor(sec_num / 60);
  var seconds = Math.floor(sec_num % 60);

  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};

export default ExportDialog;
