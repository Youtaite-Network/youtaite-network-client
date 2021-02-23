import React from 'react';
import PropTypes from 'prop-types';
import getVideoId from 'get-video-id';
import axios from 'axios';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import getUrl from '../../../utils/ApiUtils';

class FindChannelByVideo extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // show
    // channelLink
    // handleNoYTVideo
    // handleSubmit
    this.state = {
      videoLink: '',
      channelVideosLink: '',
    };

    // refs
    this.defaultButton = React.createRef();
    this.input = React.createRef();
    // event handlers
    this.handleVideoLinkChange = this.handleVideoLinkChange.bind(this);
    this.handleAnalyzeLink = this.handleAnalyzeLink.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    // show changed from false to true
    const { show } = this.props;
    if (!prevProps.show && show) {
      this.input.current.focus();
      this.setChannelVideosLink();
    }
  }

  handleVideoLinkChange(e) {
    this.setState({
      videoLink: e.target.value,
    });
  }

  handleAnalyzeLink() {
    let { videoLink: id } = this.state;
    let service = 'youtube';
    const match = id.match(/[\w\d-_]{11}/g);
    if (match && match[0] !== id) {
      ({ id, service } = getVideoId(id));
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)');
      return;
    }
    // call API to get channel ID from video ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/info/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`,
      },
    })
      .then((collabInfoResponse) => {
        // set cookies
        Cookies.set('access-token', collabInfoResponse.headers['access-token'], {
          expires: new Date(collabInfoResponse.headers['access-token-expiry']),
        });
        const { channel_id: channelId } = collabInfoResponse.data;
        // call API to get channel info from channel ID
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channelId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access-token')}`,
          },
        })
          .then((peopleInfoResponse) => {
            // set cookies
            Cookies.set('access-token', peopleInfoResponse.headers['access-token'], {
              expires: new Date(peopleInfoResponse.headers['access-token-expiry']),
            });
            const { handleSubmit } = this.props;
            handleSubmit(peopleInfoResponse.data);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click();
    }
  }

  setChannelVideosLink() {
    const { channelLink } = this.props;
    const url = getUrl(channelLink);
    if (url) {
      let path = '';
      // remove any parts of the URL path after channel name
      const pathParts = url.pathname.split('/');
      if (['user', 'channel', 'c'].includes(pathParts[1])) {
        path = pathParts.slice(0, 3).join('/');
      } else {
        path = pathParts.slice(0, 2).join('/');
      }
      this.setState({
        channelVideosLink: `${url.protocol}//${url.hostname}${path}/videos`,
      });
    }
  }

  render() {
    const { show, handleNoYTVideo } = this.props;
    const { videoLink, channelVideosLink } = this.state;

    return show && (
      <>
        <hr />
        <Form.Group>
          <Form.Label>
            Enter a YouTube video posted by
            <a href={channelVideosLink}>their channel</a>
          </Form.Label>
          <Form.Control
            type="video_link"
            placeholder="https://youtube.com/watch?v=XXXXX"
            value={videoLink}
            onChange={this.handleVideoLinkChange}
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </Form.Group>
        <Button className="mr-1" variant="secondary" onClick={handleNoYTVideo}>
          They do not have any videos
        </Button>
        <Button ref={this.defaultButton} className="ml-1" variant="primary" disabled={videoLink.length === 0} onClick={this.handleAnalyzeLink}>
          Analyze link
        </Button>
      </>
    );
  }
}

FindChannelByVideo.propTypes = {
  show: PropTypes.bool.isRequired,
  channelLink: PropTypes.string.isRequired,
  handleNoYTVideo: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default FindChannelByVideo;
