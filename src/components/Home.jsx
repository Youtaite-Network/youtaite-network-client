import React, { useState, useEffect, useRef } from 'react'
import Network from './Network'
import NetworkSettings from './NetworkSettings'
import axios from 'axios'

function Home(props) {
  const [range, setRange] = useState(null)
  const [data, setData] = useState(null)
  const [loadMessage, setLoadMessage] = useState('Initializing...')
  const startRange = useRef()

  useEffect(() => {
    const newData = {}
    setLoadMessage('Fetching edge data...')
    axios('https://youtaite-network-api.herokuapp.com/edges')
      .then(response => {
        newData.edgeStrength = response.data
        setLoadMessage('Fetching collab data...')
        axios('https://youtaite-network-api.herokuapp.com/collabs')
          .then(response => {
            newData.nodes = response.data
            setData(newData)
            const maxRange = Math.max(...Object.keys(newData.edgeStrength)) + 1
            const minRange = maxRange > 1 ? 2 : 1
            startRange.current = [minRange, maxRange]
            setRange(startRange.current)
            setLoadMessage('Drawing network...')
            console.log(newData)
          })
          .catch(function(error) {
            console.log(error)
          })
      })
      .catch(function(error) {
        console.log(error)
      })
    // setTimeout(() => {
    //   setData({
    //     nodes: [
    //       {id: 1, title: 1, thumbnail: 'https://i.ytimg.com/vi/wzl53pm2548/mqdefault.jpg'},
    //       {id: 2, title: 2, thumbnail: 'https://i.ytimg.com/vi/Xy9qwKajpgM/mqdefault.jpg'},
    //       {id: 3, title: 3, thumbnail: 'https://i.ytimg.com/vi/debzHTI4a8I/mqdefault.jpg'},
    //     ],
    //     edgeStrength: {
    //       1: [{source: 1, target: 2}],
    //       5: [{source: 2, target: 3}],
    //       10: [{source: 1, target: 3}],
    //     },
    //   })
    //   startRange.current = [2, 11]
    //   setRange(startRange.current)
    // }, 2000)
  }, [])

  return (
    <div className="container mt-3">
      <h2>Youtaite Network</h2>
      <NetworkSettings startRange={startRange.current} setRange={setRange} />
      <Network range={range} dataset={data} loadMessage={loadMessage} />
    </div>
  );
}

export default Home