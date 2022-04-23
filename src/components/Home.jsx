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

  useEffect(() => {
    const testing = false;
    if (testing) {
      setTimeout(() => {
        setData(require('../data/large.json')); // eslint-disable-line global-require
        initialRange.current = [3, 11];
        setRange(initialRange.current);
      }, 2000);
    } else {
      const newData = {};
      // get edge data
      setLoadMessage('Fetching link data...');
      axios(`${process.env.REACT_APP_API_URL}/edges`)
        .then((edgesResponse) => {
          newData.freqToEdges = edgesResponse.data.freq_to_edges;
          newData.personEdges = edgesResponse.data.person_edges;
          // get collab data
          setLoadMessage('Fetching collab data...');
          axios(`${process.env.REACT_APP_API_URL}/collabs`)
            .then((collabsResponse) => {
              setLoadMessage('Analyzing collab data...');
              // remove any collabs that have no people
              let collabIds = [];
              newData.personEdges.forEach((pe) => {
                collabIds.push(pe.edge.source);
                collabIds.push(pe.edge.target);
              });
              collabIds = [...new Set(collabIds)];
              newData.nodes = collabsResponse.data
                .filter((collab) => collabIds.includes(collab.id));
              // calculate and set range
              const maxRange = Math.max(...Object.keys(newData.freqToEdges)) + 1;
              const minRange = maxRange >= 5 ? 3 : 1;
              initialRange.current = [minRange, maxRange];
              setRange(initialRange.current);
              // get people data
              setLoadMessage('Fetching people data...');
              axios(`${process.env.REACT_APP_API_URL}/people`)
                .then((peopleResponse) => {
                  newData.people = peopleResponse.data;
                  // set data/initialize network
                  setData(newData);
                  setLoadMessage('Drawing network...');
                })
                .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
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
