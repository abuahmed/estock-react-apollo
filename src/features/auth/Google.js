import React from 'react'
import GoogleLogin from 'react-google-login'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import { makeStyles } from '@material-ui/core/styles'
// icons sets
import { useAppDispatch } from '../../app/hooks'
import { google } from './authSlice'
const useStyles = makeStyles((theme) => ({
  go: {
    backgroundColor: 'rgb(220, 0, 78)',
    color: 'white',
    width: '100%',
    display: 'block',
  },
}))

const Google = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const responseGoogle = (response) => {
    dispatch(google({ idToken: response.tokenId }))
  }
  const failResponseGoogle = (response) => {
    //dispatch(google({ idToken: response.tokenId }));
  }
  return (
    <Box pb={2}>
      <GoogleLogin
        clientId="287014686210-l0hlb5hjd8dg45o9cjpebalgn80dmde2.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={failResponseGoogle}
        autoLoad={false}
        render={(renderProps) => (
          <Button variant="contained" className={classes.go} onClick={renderProps.onClick}>
            <i className="fa fa-google pr-2"></i> Login with Google
          </Button>
        )}
        cookiePolicy={'single_host_origin'}
      />
    </Box>
  )
}

export default Google
