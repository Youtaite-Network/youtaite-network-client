import React from 'react'
import Linkify from 'linkifyjs/react'

function VideoDescription({description, byline, setTooltipData}) {
  let itemsArray = [<strong key={`byline`}>{byline}</strong>, <br key={`br-byline`}/>]
  description.split("\n").forEach((line, i) => {
    itemsArray.push(<span key={`span-${i.toString()}`}>{line}</span>)
    itemsArray.push(<br key={`br-${i.toString()}`}/>)
  })

  let linkProps = {
    onMouseOver: e => {
      console.log(e)
      setTooltipData({
        name: 'Lyn',
        link: e.target.innerText,
        thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwnh42SLr-gcD8dpOOVhyQTVbIvoaj9G7L-Fsdzn02g=s176-c-k-c0x00ffffff-no-rj',
        show: true,
        x: `${e.pageX}px`,
        y: `${e.pageY}px`,
      })
    }
  }

  return (
    <Linkify className="d-inline" options={{attributes: linkProps}}>
      {itemsArray}
    </Linkify>
  )
}

export default VideoDescription
