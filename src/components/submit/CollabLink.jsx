import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import getVideoId from 'get-video-id'
import axios from 'axios'
import Cookies from 'js-cookie'

class CollabLink extends React.Component {
  constructor(props) {
    super(props)
    // PROPS
    // handleSubmit
    // resetOnChange
    this.state = {
      collabLink: '',
    }

    // refs
    this.defaultButton = React.createRef()
    this.input = React.createRef()
    // event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleCollabLinkChange = this.handleCollabLinkChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  resetState() {
    this.setState({
      collabLink: '',
    })
    this.input.current.focus()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetOnChange !== this.props.resetOnChange) {
      this.resetState()
    }
  }

  handleCollabLinkChange(e) {
    this.setState({
      collabLink: e.target.value,
    })
  }

  handleClick(e) {
    // get YT video ID
    let id = this.state.collabLink
    let service = 'youtube'
    let match = id.match(/[\w\d-_]{11}/g)
    if (match && match[0] !== id) {
      ({id, service} = getVideoId(this.state.collabLink))
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)')
      return
    }
    // call youtaite-network-api.herokuapp.com to get title & description from ID
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
        let {title, description, channel_id} = response.data
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
            let {name} = response.data
            let byline = `posted by: ${name} (https://youtube.com/channel/${channel_id})`
            this.props.handleClick(title, byline, description, id)
          })
      })
      .catch(error => console.log(error))


  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click()
    }
  }

  render() {
    return (
      <Form.Group>
        <div className="mb-2">
          <Form.Label>YouTube video link</Form.Label>
          <Form.Control 
            type="yt_link" 
            placeholder="https://youtube.com/watch?v=XXXXXX" 
            value={this.state.collabLink} 
            onChange={this.handleCollabLinkChange}
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </div>
        <Button ref={this.defaultButton} variant="primary" onClick={this.handleClick}>
          Analyze link
        </Button>
      </Form.Group>
    );
  }
}

export default CollabLink;


