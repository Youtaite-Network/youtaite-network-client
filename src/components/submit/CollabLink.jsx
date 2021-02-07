import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

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
    this.props.handleClick(this.state.collabLink)
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
          <Form.Label>YouTube video link</Form.Label>
          <Form.Control 
            type="yt_link" 
            placeholder="https://youtube.com/watch?v=XXXXXX" 
            value={this.state.collabLink} 
            onChange={this.handleCollabLinkChange}
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </Form.Group>
        <Button ref={this.defaultButton} variant="primary" onClick={this.handleClick}>
          Analyze link
        </Button>
      </Form.Group>
    );
  }
}

export default CollabLink;


