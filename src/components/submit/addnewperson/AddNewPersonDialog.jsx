import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ChannelResults from './ChannelResults'
import OtherSocial from './OtherSocial'
import FindChannelByVideo from './FindChannelByVideo'
import FindChannelByLink from './FindChannelByLink'
import EnterAlias from './EnterAlias'

function AddNewPersonDialog({show, handleAddNewPerson, handleClose}) {
  // state
  const [showChannelResults, setShowChannelResults] = useState(false)
  const [showFindChannelByVideo, setShowFindChannelByVideo] = useState(false)
  const [showOtherSocial, setShowOtherSocial] = useState(false)
  const [showEnterAlias, setShowEnterAlias] = useState(false)
  const [channelResults, setChannelResults] = useState([])
  const [channelLink, setChannelLink] = useState('')
  // refs
  const channelLinkInput = useRef('')
  // if show changes from false => true, then focus input
  useEffect(() => {
    if (show) {
      channelLinkInput.current.focus()
    }
  }, [show])

  const resetState = () => {
    setShowChannelResults(false)
    setShowFindChannelByVideo(false)
    setShowOtherSocial(false)
    setShowEnterAlias(false)
    setChannelResults([])
    setChannelLink('')
  }

  const handleNoYTVideo = e => {
    setShowChannelResults(false)
    setShowFindChannelByVideo(false)
    setShowOtherSocial(false)
    setShowEnterAlias(true)
  }

  const useFindChannelByVideo = e => {
    setShowChannelResults(false)
    setShowFindChannelByVideo(true)
    setShowOtherSocial(false)
    setShowEnterAlias(false)
  }

  const useOtherSocial = e => {
    setShowChannelResults(false)
    setShowFindChannelByVideo(false)
    setShowOtherSocial(true)
    setShowEnterAlias(false)
  }

  const analyzeChannelData = (channelLink, data) => {
    if (Array.isArray(data)) {
      setShowChannelResults(true)
      setShowFindChannelByVideo(false)
      setShowOtherSocial(false)
      setShowEnterAlias(false)
      setChannelLink(channelLink)
      setChannelResults(data)
    } else {
      addNewPerson(data)
    }
  }

  const addNewPerson = person => {
    handleAddNewPerson(person)
    resetState()
  }

  return (
    <Modal animation={false} restoreFocus={false} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Person</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FindChannelByLink
          input={channelLinkInput}
          handleNoYTChannel={useOtherSocial}
          handleSubmit={analyzeChannelData} />
        <ChannelResults 
          show={showChannelResults}
          data={channelResults}
          handleChannelFound={addNewPerson}
          handleChannelNotFound={useFindChannelByVideo} />
        <FindChannelByVideo
          show={showFindChannelByVideo}
          channelLink={channelLink}
          handleNoYTVideo={handleNoYTVideo}
          handleSubmit={addNewPerson} />
        <OtherSocial
          show={showOtherSocial}
          handleSubmit={addNewPerson} />
        <EnterAlias
          show={showEnterAlias}
          channelLink={channelLink}
          handleSubmit={addNewPerson} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewPersonDialog;
