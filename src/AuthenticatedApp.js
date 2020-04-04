import React, { useState } from 'react'
import Player from './components/Player'
import AppBarComponent from './components/AppBar'
import { Button } from '@material-ui/core'

const AuthenticatedApp = () => {
  const [started, setStarted] = useState(false)
  return (
    <div>
      <AppBarComponent />
      {started ? (
        <Player />
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginTop: '30%' }}
          onClick={() => setStarted(true)}
        >
          Start Player
        </Button>
      )}
    </div>
  )
}

export default AuthenticatedApp
