import React, { useContext } from 'react'
import GoogleLogin from 'react-google-login'
import axios from 'axios'
import Cookies from 'js-cookie'
import AlertContext from './AlertContext'

function GoogleLoginWrapper() {
  const { setAlert } = useContext(AlertContext)

  const onSuccess = user => {
    let idtoken = user.getAuthResponse().id_token
    const params = new URLSearchParams()
    params.append('idtoken', idtoken)
    axios.post('https://youtaite-network-api.herokuapp.com/googlesignin', 
      params, // data
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}) // headers
      .then(response => {
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['access-token-expiry'])
        })
        setAlert('sign-in')
      })
      .catch(error => {
        setAlert(['sign-in', 'Sign in failed', 'danger'])
        console.log(error)
      })
  }

  const onFailure = error => {
    setAlert(['sign-in', 'Sign in failed', 'danger'])
    console.log(error)
  }

  return (
    <GoogleLogin
      clientId="242592601877-1unlb9i5rj8ianutc3o8cfgeu84t83a8.apps.googleusercontent.com"
      buttonText="Sign in"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default GoogleLoginWrapper

