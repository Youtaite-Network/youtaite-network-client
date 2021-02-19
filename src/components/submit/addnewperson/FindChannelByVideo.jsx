import React from 'react'
import getVideoId from 'get-video-id'
import axios from 'axios'
import Cookies from 'js-cookie'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class FindChannelByVideo extends React.Component {
  constructor (props) {
    super(props)
    // PROPS
    // show
    // channelLink
    // handleNoYTVideo
    // handleSubmit
    this.state = {
      videoLink: '',
      channelVideosLink: ''
    }

    // refs
    this.defaultButton = React.createRef()
    this.input = React.createRef()
    // event handlers
    this.handleVideoLinkChange = this.handleVideoLinkChange.bind(this)
    this.handleAnalyzeLink = this.handleAnalyzeLink.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidUpdate (prevProps) {
    // show changed from false to true
    if (!prevProps.show && this.props.show) {
      this.input.current.focus()
      let channelLink = this.props.channelLink
      if (!channelLink.startsWith('http')) {
        channelLink = 'https://' + channelLink
      }
      try {
        const url = new URL(channelLink)
        let path = ''
        const pathParts = url.pathname.split('/')
        if (['user', 'channel', 'c'].includes(pathParts[1])) {
          path = pathParts.slice(0, 3).join('/')
        } else {
          path = pathParts.splice(0, 2).join('/')
        }
        this.setState({
          channelVideosLink: `${url.protocol}//${url.hostname}${path}/videos`
        })
      } catch (e) {
        console.log(`Could not analyze channel link: ${channelLink}`, e)
      }
    }
  }

  handleVideoLinkChange (e) {
    this.setState({
      videoLink: e.target.value
    })
  }

  handleAnalyzeLink (e) {
    let id = this.state.videoLink
    let service = 'youtube'
    const match = id.match(/[\w\d-_]{11}/g)
    if (match && match[0] !== id) {
      ({ id, service } = getVideoId(this.state.videoLink))
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)')
      return
    }
    // call API to get channel ID from video ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/info/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`
      }
    })
      .then(response => {
        // set cookies
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['access-token-expiry'])
        })
        const { channel_id } = response.data
        // call API to get channel info from channel ID
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channel_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('access-token')}`
          }
        })
          .then(response => {
            // set cookies
            Cookies.set('access-token', response.headers['access-token'], {
              expires: new Date(response.headers['access-token-expiry'])
            })
            this.props.handleSubmit(response.data)
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  handleKeyDown (e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click()
    }
  }

  render () {
    return (
      <div className={this.props.show ? '' : 'd-none'}>
        <hr />
        <Form.Group>
          <Form.Label>Enter a YouTube video posted by <a href={this.state.channelVideosLink}>their channel</a></Form.Label>
          <Form.Control
            type='video_link'
            placeholder='https://youtube.com/watch?v=XXXXX'
            value={this.state.videoLink}
            onChange={this.handleVideoLinkChange}
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </Form.Group>
        <Button className='mr-1' variant='secondary' onClick={this.props.handleNoYTVideo}>
          They do not have any videos
        </Button>
        <Button ref={this.defaultButton} className='ml-1' variant='primary' disabled={this.state.videoLink.length === 0} onClick={this.handleAnalyzeLink}>
          Analyze link
        </Button>
      </div>
    )
  }
}

export default FindChannelByVideo
