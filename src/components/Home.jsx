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
        newData.freqToEdges = response.data.freq_to_edges
        newData.personEdges = response.data.person_edges
        setLoadMessage('Fetching collab data...')
        axios('https://youtaite-network-api.herokuapp.com/collabs')
          .then(response => {
            newData.nodes = response.data
            const maxRange = Math.max(...Object.keys(newData.freqToEdges)) + 1
            const minRange = maxRange > 1 ? 2 : 1
            startRange.current = [minRange, maxRange]
            setRange(startRange.current)
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
    //   const data = {
    //     nodes: [
    //       {id: 1, title: 1, thumbnail: 'https://i.ytimg.com/vi/wzl53pm2548/mqdefault.jpg'},
    //       {id: 2, title: 2, thumbnail: 'https://i.ytimg.com/vi/Xy9qwKajpgM/mqdefault.jpg'},
    //       {id: 3, title: 3, thumbnail: 'https://i.ytimg.com/vi/debzHTI4a8I/mqdefault.jpg'},
    //     ],
    //     freqToEdges: {
    //       1: [{source: 1, target: 2}],
    //       3: [{source: 2, target: 3}],
    //       4: [{source: 1, target: 3}],
    //     },
    //     personEdges: [ // p: person; e: edge; i: index, l: length
    //       {person: 1, edge: {source: 1, target: 2}, i: 0, l: 1},
    //       {person: 1, edge: {source: 2, target: 3}, i: 0, l: 3},
    //       {person: 2, edge: {source: 2, target: 3}, i: 1, l: 3},
    //       {person: 2, edge: {source: 1, target: 3}, i: 0, l: 4},
    //       {person: 3, edge: {source: 2, target: 3}, i: 2, l: 3},
    //       {person: 3, edge: {source: 1, target: 3}, i: 1, l: 4},
    //       {person: 4, edge: {source: 1, target: 3}, i: 2, l: 4},
    //       {person: 5, edge: {source: 1, target: 3}, i: 3, l: 4},
    //     ],
    //     people: [
    //       {id: 1, name: 'A', thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwnjetAQkonH0ZwvQsT2jIYQ3c7uBTq-yTd7Lrc0x8DI=s88-c-k-c0x00ffffff-no-rj'},
    //       {id: 2, name: 'B', thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwnisqdGRqbSoVwgEUYzb7kghu02FKVGdoNWnCrMu=s88-c-k-c0x00ffffff-no-rj'},
    //       {id: 3, name: 'C', thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwniYuZJRiUVkPgQAhvb88jZXG_CYO8mCPg-F9x44=s88-c-k-c0x00ffffff-no-rj'},
    //       {id: 4, name: 'D', thumbnail: '#'},
    //       {id: 5, name: 'E', thumbnail: 'https://yt3.ggpht.com/ytc/AAUvwniV08KsDl4r2bLEzqpeTygO8k9i01KaL4shte5Rog=s88-c-k-c0x00ffffff-no-rj'},
    //     ],
    //   }
    //   setData(data)
    //   startRange.current = [1, 5]
    //   setRange(startRange.current)
    // }, 2000)
  }, [])

  return (
    <div className="container mt-3">
      <h2>Youtaite Network</h2>
      <NetworkSettings startRange={startRange.current} setRange={setRange} />
      <Network rangeProp={range} datasetProp={data} loadMessage={loadMessage} />
    </div>
  );
}

export default Home