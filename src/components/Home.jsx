import React, { useState, useEffect } from 'react'
import Network from './Network'
import NetworkSettings from './NetworkSettings'
import axios from 'axios'

function Home(props) {
  const [range, setRange] = useState([0, 0])
  const [data, setData] = useState({nodes: [], edgeStrength: {}})

  useEffect(() => {
    const newData = {}
    axios('https://youtaite-network-api.herokuapp.com/edges')
      .then(response => {
        newData.edgeStrength = response.data
        axios('https://youtaite-network-api.herokuapp.com/collabs')
          .then(response => {
            newData.nodes = response.data
            setData(newData)
            setRange([1, Math.max(Object.keys(newData.edgeStrength)) + 1])
          })
          .catch(function(error) {
            console.log(error)
          })
      })
      .catch(function(error) {
        console.log(error)
      })
    // setData({
    //   nodes: [
    //     {id: 1, title: 1, thumbnail: 'https://i.ytimg.com/vi/wzl53pm2548/mqdefault.jpg'},
    //     {id: 2, title: 2, thumbnail: 'https://i.ytimg.com/vi/Xy9qwKajpgM/mqdefault.jpg'},
    //     {id: 3, title: 3, thumbnail: 'https://i.ytimg.com/vi/debzHTI4a8I/mqdefault.jpg'},
    //   ],
    //   edgeStrength: {
    //     1: [{source: 1, target: 2}],
    //     5: [{source: 2, target: 3}],
    //     10: [{source: 1, target: 3}],
    //   },
    // })
    // setRange([1, 11])
  }, [])

  return (
    <div className="container mt-3">
      <h2>Youtaite Network</h2>
      <NetworkSettings maxStrength={10} range={range} setRange={setRange} />
      <Network range={range} dataset={data} />
    </div>
  );
}

export default Home