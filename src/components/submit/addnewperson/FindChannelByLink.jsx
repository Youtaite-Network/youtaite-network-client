import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class FindChannelByLink extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // handleNoYTChannel
    // handleSubmit
    // input
    this.state = {
      channelLink: '',
    };

    // refs
    this.defaultButton = React.createRef()
    // event handlers
    this.handleChannelLinkChange = this.handleChannelLinkChange.bind(this)
    this.analyzeChannelLink = this.analyzeChannelLink.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  handleChannelLinkChange(e) {
    this.setState({
      channelLink: e.target.value,
    })
  }

  analyzeChannelLink(e) {
    let link = this.state.channelLink
    if (link.startsWith('http')) { // remove protocol
      let url = new URL(link)
      link = `${url.hostname}${url.pathname}` 
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
        this.props.handleSubmit(this.state.channelLink, response.data)
      })
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click()
    }
  }

  render() {
    return (
      <Form.Group>
        <Form.Group>
          <Form.Label>Channel link (YouTube)</Form.Label>
          <Form.Control 
            type="channel_link" 
            placeholder="https://youtube.com/channel/XXXXXXXXX" 
            value={this.state.channelLink} 
            onChange={this.handleChannelLinkChange}
            onKeyDown={this.handleKeyDown}
            ref={this.props.input}
          />
        </Form.Group>
        <Button className="mr-1" variant="secondary" onClick={this.props.handleNoYTChannel}>
          No YouTube link available
        </Button>
        <Button ref={this.defaultButton} className="ml-1" variant="primary" disabled={this.state.channelLink.length === 0} onClick={this.analyzeChannelLink}>
          Analyze link
        </Button>
      </Form.Group>
    );
  }
}

export default FindChannelByLink;