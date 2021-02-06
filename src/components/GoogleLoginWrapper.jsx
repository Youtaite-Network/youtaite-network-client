import React from "react";
import GoogleLogin from 'react-google-login'
import axios from 'axios'
import Cookies from 'js-cookie'

class GoogleLoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onSuccess = this.onSuccess.bind(this)
    this.onFailure = this.onFailure.bind(this)
  }

  onSuccess(user) {
    let idtoken = user.getAuthResponse().id_token
    const params = new URLSearchParams()
    params.append('idtoken', idtoken)
    axios.post('https://youtaite-network-api.herokuapp.com/googlesignin', 
      params, // data
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}) // headers
      .then(response => {
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  onFailure(error) {
    console.log(error)
  }

  render() {
    return (
      <GoogleLogin
        clientId="242592601877-1unlb9i5rj8ianutc3o8cfgeu84t83a8.apps.googleusercontent.com"
        buttonText="Sign in"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
        cookiePolicy={'single_host_origin'}
      />
    );
  }
}

export default GoogleLoginWrapper;

