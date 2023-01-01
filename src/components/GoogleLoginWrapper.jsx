import React, { useContext } from 'react';
import GoogleLogin from 'react-google-login';
import networkApi from '../utils/YoutaiteNetworkApi';
import AlertContext from './AlertContext';

function GoogleLoginWrapper() {
  const { setAlert } = useContext(AlertContext);

  const onSuccess = (user) => {
    const idtoken = user.getAuthResponse().id_token;
    const params = new URLSearchParams({ idtoken });
    networkApi.post(
      'googlesignin',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
      .then((response) => {
        networkApi.setAccessTokenCookie(response);
        setAlert(['sign-in']);
      })
      .catch((error) => {
        setAlert(['sign-in', 'Sign in failed', 'danger']);
        console.error(error);
      });
  };

  const onFailure = (error) => {
    if (error.error === 'idpiframe_initialization_failed') {
      setAlert(['sign-in', 'Please enable 3rd party cookies to use this site in incognito.', 'danger']);
    }
    console.error(error);
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Sign in"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy="single_host_origin"
    />
  );
}

export default GoogleLoginWrapper;
