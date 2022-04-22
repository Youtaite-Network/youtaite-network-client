function addProtocolIfNeeded(url) {
  if (url.startsWith('http')) {
    return url;
  }
  return `https://${url}`;
}

function getUrl(urlString) {
  const urlWithProtocol = addProtocolIfNeeded(urlString);
  try {
    return new URL(urlWithProtocol);
  } catch (e) {
    console.error(`Could not parse url: ${urlString}`, e);
    return null;
  }
}

export default getUrl;
