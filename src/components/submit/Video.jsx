import React from 'react';
import PropTypes from 'prop-types';

function Video({ ytId }) {
  return (
    <div
      className="float-right mr-3 responsive-iframe-container"
      style={{ width: '40%', paddingTop: '22%' }}
    >
      <iframe
        title="yt-embed"
        className="responsive-iframe"
        width="560"
        height="315"
        src={`https://youtube.com/embed/${ytId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

Video.propTypes = {
  ytId: PropTypes.string.isRequired,
};

export default Video;
