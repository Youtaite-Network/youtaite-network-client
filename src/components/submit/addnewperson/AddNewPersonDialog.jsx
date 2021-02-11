import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ChannelResults from './ChannelResults'
import OtherSocial from './OtherSocial'
import FindChannelByVideo from './FindChannelByVideo'
import FindChannelByLink from './FindChannelByLink'
import EnterAlias from './EnterAlias'

class AddNewPersonDialog extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // show
    // addNewPerson
    // handleClose
    this.state = {
      showChannelResults: false,
      showFindChannelByVideo: false,
      showOtherSocial: false,
      showEnterAlias: false,
      channelResults: [],
      channelLink: '',
    };

    // refs
    this.channelLinkInput = React.createRef()
    // event handlers
    this.handleNoYTChannel = this.handleNoYTChannel.bind(this)
    this.useFindChannelByVideo = this.useFindChannelByVideo.bind(this)
    this.addNewPerson = this.addNewPerson.bind(this)
    this.handleNoYTVideo = this.handleNoYTVideo.bind(this)
    this.useOtherSocial = this.useOtherSocial.bind(this)
    this.analyzeChannelData = this.analyzeChannelData.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.channelLinkInput.current.focus()
    }
  }

  resetState(callback) {
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: false,
      showOtherSocial: false,
      showEnterAlias: false,
      channelResults: [],
      channelLink: '',
    })
  }

  handleNoYTChannel(e) {
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: false,
      showOtherSocial: true,
      showEnterAlias: false,
    })
  }

  handleNoYTVideo(e) {
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: false,
      showOtherSocial: false,
      showEnterAlias: true,
    })
  }

  useFindChannelByVideo(e) {
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: true,
      showOtherSocial: false,
      showEnterAlias: false,
    })
  }

  useOtherSocial(e) {
    this.setState({
      showChannelResults: false,
      showFindChannelByVideo: false,
      showOtherSocial: true,
      showEnterAlias: false,
    })
  }

  analyzeChannelData(channelLink, data) {
    if (Array.isArray(data)) {
      this.setState({
        showChannelResults: true,
        showFindChannelByVideo: false,
        showOtherSocial: false,
        showEnterAlias: false,
        channelLink: channelLink,
        channelResults: data, // [{name, yt_id, thumbnail}, ...]
      })
    } else {
      this.addNewPerson(data)
    }
  }

  addNewPerson(person) {
    this.props.addNewPerson(person)
    this.resetState()
  }

  render() {    
    return (
      <Modal animation={false} restoreFocus={false} show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FindChannelByLink
            input={this.channelLinkInput}
            handleNoYTChannel={this.useOtherSocial}
            handleSubmit={this.analyzeChannelData} />
          <ChannelResults 
            show={this.state.showChannelResults}
            data={this.state.channelResults}
            handleChannelFound={this.addNewPerson}
            handleChannelNotFound={this.useFindChannelByVideo} />
          <FindChannelByVideo
            show={this.state.showFindChannelByVideo}
            channelLink={this.state.channelLink}
            handleNoYTVideo={this.handleNoYTVideo}
            handleSubmit={this.addNewPerson} />
          <OtherSocial
            show={this.state.showOtherSocial}
            handleSubmit={this.addNewPerson} />
          <EnterAlias
            show={this.state.showEnterAlias}
            channelLink={this.state.channelLink}
            handleSubmit={this.addNewPerson} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddNewPersonDialog;
