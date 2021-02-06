import React from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import ChannelResults from './ChannelResults'
import getVideoId from 'get-video-id'
import Cookies from 'js-cookie'

class AddNewPersonDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelLink: '',
      channelVideosLink: '',
      showChannelResults: false,
      channelResults: [],
      showFindChannelByVideo: false,
      videoLink: '',
    };

    this.handleClose = this.handleClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChannelLinkChange = this.handleChannelLinkChange.bind(this)
    this.handleNoYTChannel = this.handleNoYTChannel.bind(this)
    this.handleAnalyzeChannelLink = this.handleAnalyzeChannelLink.bind(this)
    this.findChannelByVideo = this.findChannelByVideo.bind(this)
    this.handleVideoLinkChange = this.handleVideoLinkChange.bind(this)
    this.handleAnalyzeVideoLink = this.handleAnalyzeVideoLink.bind(this)
    this.handleChannelFound = this.handleChannelFound.bind(this)
  }

  resetState() {
    this.setState({
      channelLink: '',
      channelVideosLink: '',
      showChannelResults: false,
      channelResults: [],
      showFindChannelByVideo: false,
      videoLink: '',
    })
  }

  handleChannelLinkChange(e) {
    this.setState({
      channelLink: e.target.value,
    })
  }

  handleClose(e) {
    console.log('handleClose', e)
  }

  handleSubmit(e) {
    console.log('handleSubmit', e)
  }

  handleNoYTChannel(e) {
    console.log('handleNoYTChannel', e)
  }

  findChannelByVideo(e) {
    let channelLink = this.state.channelLink
    if (!channelLink.startsWith('http')) {
      channelLink = 'https://' + channelLink
    }
    let url = new URL(channelLink)
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: true,
      channelVideosLink: `${url.protocol}//${url.hostname}${url.pathname}/videos`,
    })
  }

  handleVideoLinkChange(e) {
    this.setState({
      videoLink: e.target.value,
    })
  }

  handleAnalyzeChannelLink(e) {
    console.log('handleAnalyzeChannelLink', e)
    let link = this.state.channelLink
    let url = new URL(link)
    if (url.protocol) {
      link = `${url.hostname}${url.pathname}` // remove protocol
    }
    axios(`https://youtaite-network-api.herokuapp.com/people/info_from_url/${link}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access-token')}`
      },
    })
      .then(response => {
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
        if (response.data.length > 1) {
          this.setState({
            showChannelResults: true,
            channelResults: response.data // [{name, yt_id, thumbnail}, ...]
          })
        } else {
          this.handleChannelFound(response.data[0])
        }
      })
  }

  handleChannelFound(person) {
    this.resetState()
    this.props.handleChannelFound(person)
  }

  handleAnalyzeVideoLink(e) {
    console.log('handleAnalyzeVideoLink', e)
    let id = this.state.videoLink
    let service = 'youtube'
    if (id.match(/[\w\d-_]{11}/g)[0] !== id) {
      ({id, service} = getVideoId(this.state.videoLink))
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)')
      return
    }
    // call API to get channel ID from video ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/info/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access-token')}`
      }
    })
      .then(response => {
        // set cookies
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
        let {channel_id} = response.data
        // call API to get channel info from channel ID
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channel_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access-token')}`
          }
        })
          .then(response => {
            // set cookies
            Cookies.set('access-token', response.headers['access-token'], {
              expires: new Date(response.headers['expiry'])
            })
            this.handleChannelFound(response.data)
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  render() {    
    return (
      <Modal show={this.props.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="link-form">
              <Form.Group controlId="form-yt-link">
                <Form.Label>Channel link (YouTube)</Form.Label>
                <Form.Control 
                  type="channel_link" 
                  placeholder="https://youtube.com/channel/XXXXXXXXX" 
                  value={this.state.channelLink} 
                  onChange={this.handleChannelLinkChange}
                />
              </Form.Group>
              <Button className="mr-1" variant="secondary" onClick={this.handleNoYTChannel}>
                No YouTube link available
              </Button>
              <Button className="ml-1" variant="primary" disabled={this.state.channelLink.length === 0} onClick={this.handleAnalyzeChannelLink}>
                Analyze link
              </Button>
            </Form.Group>
            <div className={this.state.showChannelResults ? '' : 'd-none'}>
              <hr/>
              <ChannelResults 
                data={this.state.channelResults}
                handleChannelFound={this.handleChannelFound}
                handleChannelNotFound={this.findChannelByVideo} />
            </div>
            <div className={this.state.showFindChannelByVideo ? '' : 'd-none'}>
              <hr/>
              <Form.Group>
                <Form.Label>Enter a YouTube video posted by <a href={this.state.channelVideosLink}>their channel</a></Form.Label>
                <Form.Control
                  type="video_link"
                  placeholder="https://youtube.com/watch?v=XXXXX"
                  value={this.state.videoLink}
                  onChange={this.handleVideoLinkChange} />
              </Form.Group>
              <Button className="mr-1" variant="secondary" onClick={this.handleNoYTChannel}>
                They do not have any videos
              </Button>
              <Button className="ml-1" variant="primary" disabled={this.state.channelLink.length === 0} onClick={this.handleAnalyzeVideoLink}>
                Analyze link
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddNewPersonDialog;


