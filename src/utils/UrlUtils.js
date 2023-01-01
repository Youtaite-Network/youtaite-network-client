function addProtocolIfNeeded(url) {
  if (url.startsWith('http')) {
    return url;
  }
  return `https://${url}`;
}

function getUrl(urlString) {
  const urlWithProtocol = addProtocolIfNeeded(urlString);
  return new URL(urlWithProtocol);
}

export { getUrl }; // eslint-disable-line import/prefer-default-export
