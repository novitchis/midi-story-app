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
  CircularProgress,
  Paper,
} from '@material-ui/core';
import useEncoder from './useEncoder';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import GetAppIcon from '@material-ui/icons/GetApp';
import { downloadBlob, humanFileSize } from '../../../utils/downloadUtils';
import Unity, { UnityContent } from 'react-unity-webgl';
import cx from 'class-names';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 460,
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
  playerInner720: {
    height: 720,
    width: 1280,
    transform: 'scale(0.36)',
    transformOrigin: 'left top',
    pointerEvents: 'none',
  },
  playerScaler: {},
  playerOuter: {
    position: 'relative',
    height: 720 * 0.36,
    width: 1280 * 0.36,
  },
  hidden: {
    visibility: 'hidden',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const ExportDialog = ({ onClose, open, fileInfo, fileName, fileURL }) => {
  const classes = useStyles();
  const [unityContent, setUnityContent] = useState(null);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // const [exportFinished, setExportFinished] = useState(false);
  const [output, setOutput] = useState(null);
  const { encoder, error } = useEncoder();

  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    let unityContent = new UnityContent(
      'Player/build.json',
      'Player/UnityLoader.js'
    );
    setUnityContent(unityContent);

    unityContent.on('loaded', () => {
      unityContent.send('Sheet', 'ReceiveFile', fileURL);
    });

    unityContent.on('FileLoaded', (fileInfo) => {
      setUnityLoaded(true);
    });
  }, [fileURL]);

  useEffect(() => {
    if (!encoder || !isExporting) return;
    setTimeout(() => {
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
          finishExport();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoder, isExporting]);

  const handleExportClick = () => {
    if (!isExporting) {
      encoder.start(fileInfo);
      setIsExporting(true);
      setOutput(null);
    } else {
      unityContent.send('Main Camera', 'StopCapturing');
      encoder.cancel();
      setIsExporting(false);
    }
  };

  const finishExport = () => {
    encoder.endEncoding().then((result) => {
      setOutput(result);
      setIsExporting(false);
    });
  };

  const encoderStatus = encoder ? encoder.getStats() : {};

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
          <Grid item xs>
            <Paper className={classes.playerOuter}>
              {!unityLoaded && (
                <div className={classes.center}>
                  <CircularProgress />
                </div>
              )}
              <div className={classes.playerScaler}>
                <div
                  className={cx(
                    classes.playerInner720,
                    !unityLoaded && classes.hidden
                  )}
                >
                  {unityContent && <Unity unityContent={unityContent} />}
                </div>
              </div>
            </Paper>
          </Grid>
          {!isExporting ? (
            <>
              {output ? (
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
                        {toMMSS(output.duration)} •{' '}
                        {humanFileSize(output.data.length)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="secondary">
                        Created in{' '}
                        <TotalTime>{encoderStatus.timeSpent}</TotalTime>,{' '}
                        <FixedNumber>{encoderStatus.fpsAverage}</FixedNumber>{' '}
                        fps average.
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
                    variant="buffer"
                    value={encoderStatus.percentageDone}
                    valueBuffer={encoderStatus.percentageBuffer}
                    color="secondary"
                  />
                </Grid>
                <Grid item>
                  {encoderStatus.fps !== -1 && (
                    <Typography variant="body2">
                      <FixedNumber>{encoderStatus.fps}</FixedNumber> fps
                    </Typography>
                  )}
                </Grid>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography variant="body2">
                    {toMMSS(encoderStatus.framesEncoded / 60)} /{' '}
                    {toMMSS(fileInfo.length)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  {encoderStatus.timeLeft !== -1 && (
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="body2"
                    >
                      <TotalTime>{encoderStatus.timeLeft}</TotalTime> left
                    </Typography>
                  )}
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
        {output ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              downloadBlob(output.data, fileName, 'video/webm');
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
            disabled={!unityLoaded}
          >
            {isExporting ? 'Stop' : 'Start'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const FixedNumber = ({ children }) => {
  return children.toFixed(1);
};

const TotalTime = ({ children }) => {
  const hours = Math.floor(children / 60 / 60);
  const minutes = Math.ceil((children / 60) % 60);
  let timeLeft = '';
  if (hours > 0) timeLeft += `${hours} hour`;
  if (hours > 1) timeLeft += 's';

  if (minutes > 0) timeLeft += ` ${minutes} minute`;
  if (minutes > 1) timeLeft += 's';

  return timeLeft.trim();
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
