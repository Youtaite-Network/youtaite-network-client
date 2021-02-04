import React from "react";
import GoogleLogin from 'react-google-login'

class GoogleLoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onSuccess = this.onSuccess.bind(this)
    this.onFailure = this.onFailure.bind(this)
  }

  onSuccess(user) {
    console.log(user)
  }

  onFailure(error) {
    console.log(error.details)
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

