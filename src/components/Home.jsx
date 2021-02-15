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