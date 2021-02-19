import React from 'react'

function Video (props) {
  const ytId = props.ytId

  return (
    <div
      className='float-right mr-3 responsive-iframe-container'
      style={{ width: '40%', paddingTop: (40 * 9 / 16) + '%' }}
    >
      <iframe
        title='yt-embed'
        className='responsive-iframe'
        width='560' height='315'
        src={`https://youtube.com/embed/${ytId}`}
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </div>
  )
}

export default Video
