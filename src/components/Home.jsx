import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Network from './Network';
import NetworkSettings from './NetworkSettings';

function Home() {
  const [range, setRange] = useState(null);
  const [drag, setDrag] = useState(true);
  const [data, setData] = useState(null);
  const [loadMessage, setLoadMessage] = useState('Initializing...');
  const initialRange = useRef(null);
  const testing = true;

  useEffect(() => {
    if (testing) {
      setTimeout(() => {
        setData(require('../data/large.json')); // eslint-disable-line global-require
        initialRange.current = [3, 11];
        setRange(initialRange.current);
      }, 2000);
    } else {
      const newData = {};
      setLoadMessage('Fetching edge data...');
      axios('https://youtaite-network-api.herokuapp.com/edges')
        .then((edgesResponse) => {
          newData.freqToEdges = edgesResponse.data.freq_to_edges;
          newData.personEdges = edgesResponse.data.person_edges;
          setLoadMessage('Fetching collab data...');
          axios('https://youtaite-network-api.herokuapp.com/collabs')
            .then((collabsResponse) => {
              newData.nodes = collabsResponse.data;
              const maxRange = Math.max(...Object.keys(newData.freqToEdges)) + 1;
              const minRange = maxRange >= 5 ? 3 : 1;
              initialRange.current = [minRange, maxRange];
              setRange(initialRange.current);
              setLoadMessage('Fetching people data...');
              axios('https://youtaite-network-api.herokuapp.com/people')
                .then((peopleResponse) => {
                  newData.people = peopleResponse.data;
                  setData(newData);
                  setLoadMessage('Drawing network...');
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <div className="container mt-3">
      <h2>Youtaite Network</h2>
      <NetworkSettings
        initialRange={initialRange.current}
        setRange={setRange}
        initialDrag
        setDrag={setDrag}
      />
      <Network
        rangeProp={range}
        datasetProp={data}
        dragProp={drag}
        loadMessage={loadMessage}
      />
    </div>
  );
}

export default Home;
