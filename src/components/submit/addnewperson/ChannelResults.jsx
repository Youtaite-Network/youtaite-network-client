import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import './ChannelResults.css';

class ChannelResults extends React.Component {
  constructor(props) {
    super(props);
    // PROPS:
    // show
    // handleChannelFound(person object)
    // handleChannelNotFound
    // data
    this.handleChannelFound = this.handleChannelFound.bind(this);
  }

  handleChannelFound(e) {
    const { id } = e.target;
    const index = id.substring(id.lastIndexOf('-') + 1);
    const { handleChannelFound, data } = this.props;
    handleChannelFound(data[index]);
  }

  render() {
    const { show, handleChannelNotFound, data } = this.props;
    const channelArray = [];
    data.forEach((channel, i) => {
      channelArray.push(
        <Button id={`channel-option-${i}`} className="btn-light d-flex flex-row align-items-center w-100" key={channel.yt_id} onClick={this.handleChannelFound}>
          <div>
            <Image className="mr-1" width="40px" height="40px" roundedCircle src={channel.thumbnail} />
          </div>
          <div className="ml-1 text-truncate">
            <strong>{channel.name}</strong>
          </div>
        </Button>,
      );
    });

    channelArray.push(
      <Button id={`channel-option-${data.length}`} className="btn-light d-flex flex-row align-items-center w-100" key="channel-array-none" onClick={handleChannelNotFound}>
        <div className="ml-1 text-truncate d-flex flex-row align-items-center" style={{ height: '40px' }}>
          <strong>None of these/Unsure</strong>
        </div>
      </Button>,
    );

    return show && (
      <>
        <hr />
        <h6>Choose the correct channel:</h6>
        {channelArray}
      </>
    );
  }
}

ChannelResults.propTypes = {
  show: PropTypes.bool.isRequired,
  handleChannelFound: PropTypes.func.isRequired,
  handleChannelNotFound: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    yt_id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  })).isRequired,
};

export default ChannelResults;
