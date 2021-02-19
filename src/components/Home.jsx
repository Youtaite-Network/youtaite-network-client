import React, { useState, useEffect, useRef } from 'react'
import Network from './Network'
import NetworkSettings from './NetworkSettings'
import axios from 'axios'

function Home (props) {
  const [range, setRange] = useState(null)
  const [drag, setDrag] = useState(true)
  const [data, setData] = useState(null)
  const [loadMessage, setLoadMessage] = useState('Initializing...')
  const initialRange = useRef()

  useEffect(() => {
    const newData = {}
    setLoadMessage('Fetching edge data...')
    axios('https://youtaite-network-api.herokuapp.com/edges')
      .then(response => {
        newData.freqToEdges = response.data.freq_to_edges
        newData.personEdges = response.data.person_edges
        setLoadMessage('Fetching collab data...')
        axios('https://youtaite-network-api.herokuapp.com/collabs')
          .then(response => {
            newData.nodes = response.data
            const maxRange = Math.max(...Object.keys(newData.freqToEdges)) + 1
            const minRange = maxRange >= 5 ? 3 : 1
            initialRange.current = [minRange, maxRange]
            setRange(initialRange.current)
            setLoadMessage('Fetching people data...')
            axios('https://youtaite-network-api.herokuapp.com/people')
              .then(response => {
                newData.people = response.data
                setData(newData)
                setLoadMessage('Drawing network...')
              })
              .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
    // setTimeout(() => {
    //   const data = require('../data/large.json')
    //   setData(data)
    //   initialRange.current = [3, 11]
    //   setRange(initialRange.current)
    // }, 2000)
  }, [])

  return (
    <div className='container mt-3'>
      <h2>Youtaite Network</h2>
      <NetworkSettings initialRange={initialRange.current} setRange={setRange} initialDrag setDrag={setDrag} />
      <Network rangeProp={range} datasetProp={data} dragProp={drag} loadMessage={loadMessage} />
    </div>
  )
}

export default Home
