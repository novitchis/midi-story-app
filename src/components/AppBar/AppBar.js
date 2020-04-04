import React from 'react'
import firebase from 'firebase'
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
} from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  popoverRoot: {
    textAlign: 'center',
    width: 300,
  },
  popoverAvatar: {
    fontSize: 64,
    color: theme.palette.grey[500],
  },
  divider: {
    margin: theme.spacing(0, 2),
  },
}))

const AppBarComponent = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const menuId = 'primary-search-account-menu'

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.target)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className={classes.grow} align="left">
          <span style={{ color: 'lightgreen' }}>midi</span>
          <span style={{ color: 'lightblue' }}>story</span>
        </Typography>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          role={undefined}
          placement="bottom"
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
              <Paper>
                <ClickAwayListener onClickAway={handleMenuClose}>
                  <Grid
                    className={classes.popoverRoot}
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
                        onClick={() => firebase.auth().signOut()}
                      >
                        Sign out
                      </Button>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Grid item>
                      <Button href="/">
                        <Typography variant="caption">
                          Privacy Policy
                        </Typography>
                      </Button>
                      •
                      <Button href="/">
                        <Typography variant="caption">
                          Terms of service
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  )
}

export default AppBarComponent
