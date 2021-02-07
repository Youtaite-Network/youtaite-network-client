import React from 'react'
import Linkify from 'react-linkify'

function VideoDescription(props) {
  const description = props.description
  const byline = props.byline
  let itemsArray = [<strong key={`byline`}>{byline}</strong>, <br key={`br-byline`}/>]
  description.split("\n").forEach((line, i) => {
    itemsArray.push(<span key={`span-${i.toString()}`}>{line}</span>)
    itemsArray.push(<br key={`br-${i.toString()}`}/>)
  })

  return (
    <Linkify className="d-inline">
      {itemsArray}
    </Linkify>
  )
}

export default VideoDescription
