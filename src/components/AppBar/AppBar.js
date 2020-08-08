import React from 'react';
import firebase from 'firebase';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  Button,
  Grid,
  Divider,
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  popoverRoot: {
    textAlign: 'center',
    width: 280,
    padding: theme.spacing(2, 0),
    border: `1px solid ${theme.palette.divider}`,
  },
  popoverAvatar: {
    fontSize: 64,
    color: theme.palette.grey[500],
  },
  divider: {
    margin: theme.spacing(0, 2),
  },
}));

const AppBarComponent = () => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const menuId = 'primary-search-account-menu';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.target);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar elevation={2} color="inherit">
      <Toolbar>
        <Link to="/">
          <Typography variant="h4" color="primary">
            Midistory
          </Typography>
        </Link>
        <div className={classes.grow}></div>

        {firebase.auth().currentUser && (
          <>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize="large" />
            </IconButton>
            <Popper
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              role={undefined}
              placement="bottom"
              style={{ zIndex: 2000 }}
              transition
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper elevation={2} className={classes.popoverRoot}>
                    <ClickAwayListener onClickAway={handleMenuClose}>
                      <Grid
                        container
                        spacing={4}
                        direction="column"
                        justify="center"
                      >
                        <Grid item>
                          <AccountCircle className={classes.popoverAvatar} />
                          <Typography>
                            {firebase.auth().currentUser.displayName}
                          </Typography>
                          <Typography variant="body2">
                            {firebase.auth().currentUser.email}
                          </Typography>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid item>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              firebase
                                .auth()
                                .signOut()
                                .then(() => history.push('/'));
                            }}
                          >
                            Sign out
                          </Button>
                        </Grid>
                        <Divider className={classes.divider} />
                        <Grid
                          item
                          container
                          spacing={1}
                          justify="center"
                          alignItems="center"
                        >
                          <Grid item>
                            <Link to="/policies/privacy">
                              <Button onClick={handleMenuClose}>
                                <Typography variant="caption">
                                  Privacy Policy
                                </Typography>
                              </Button>
                            </Link>
                          </Grid>
                          <Grid item>•</Grid>
                          <Grid item>
                            <Link to="/policies/terms">
                              <Button onClick={handleMenuClose}>
                                <Typography variant="caption">
                                  Terms of service
                                </Typography>
                              </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
