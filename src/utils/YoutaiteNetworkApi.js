import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [(data, headers) => {
    if (Cookies.get('access-token')) {
      headers.Authorization = `Bearer ${Cookies.get('access-token')}`; // eslint-disable-line no-param-reassign
    }
    return data;
  }, ...axios.defaults.transformRequest],
});

api.setAccessTokenCookie = ({ config, headers }) => {
  if (headers['access-token']) {
    Cookies.set('access-token', headers['access-token'], {
      expires: new Date(headers['access-token-expiry']),
    });
  } else {
    throw new Error(`Missing access-token header from response to ${config.url}`);
  }
};

export default api;
