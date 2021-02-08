import React from 'react'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import './ChannelResults.css'

class ChannelResults extends React.Component {
  constructor(props) {
    super(props);
    // PROPS:
    // show
    // handleChannelFound(person object)
    // handleChannelNotFound
    // data

    this.handleChannelFound = this.handleChannelFound.bind(this)
    this.handleChannelNotFound = this.handleChannelNotFound.bind(this)
  }

  handleChannelFound(e) {
    let id = e.target.id
    let index = id.substring(id.lastIndexOf('-') + 1)
    this.props.handleChannelFound(this.props.data[index])
  }

  handleChannelNotFound(e) {
    this.props.handleChannelNotFound()
  }

  render() {
    let channelArray = []
    this.props.data.forEach((channel, i) => {
      channelArray.push(
        <Button id={`channel-option-${i}`} className="btn-light d-flex flex-row align-items-center w-100" key={channel.yt_id} onClick={this.handleChannelFound}>
          <div>
            <Image className="mr-1" width="40px" height="40px" roundedCircle src={channel.thumbnail} />
          </div>
          <div className="ml-1 text-truncate"><strong>
            {channel.name}
          </strong></div>
        </Button>
      )
    })

    channelArray.push(
      <Button id={`channel-option-${this.props.data.length}`} className="btn-light d-flex flex-row align-items-center w-100" key="channel-array-none" onClick={this.props.handleChannelNotFound}>
        <div className="ml-1 text-truncate d-flex flex-row align-items-center" style={{height: '40px'}}><strong>
          None of these/Unsure
        </strong></div>
      </Button>
    )

    return (
      <div className={this.props.show ? '' : 'd-none'}>
        <hr/>
        <h6>Choose the correct channel:</h6>
        {channelArray}
      </div>
    );
  }
}

export default ChannelResults;