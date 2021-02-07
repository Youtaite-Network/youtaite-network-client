import React from 'react'
import Network from './Network'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="container mt-3">
        <h2>Youtaite Network</h2>
        <Network></Network>
      </div>
    );
  }
}

export default Home