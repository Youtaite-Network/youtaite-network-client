import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ChannelResults from './ChannelResults';
import OtherSocial from './OtherSocial';
import FindChannelByVideo from './FindChannelByVideo';
import FindChannelByLink from './FindChannelByLink';
import EnterAlias from './EnterAlias';

function AddNewPersonDialog({ show, handleAddNewPerson, handleClose }) {
  // state
  const [showChannelResults, setShowChannelResults] = useState(false);
  const [showFindChannelByVideo, setShowFindChannelByVideo] = useState(false);
  const [showOtherSocial, setShowOtherSocial] = useState(false);
  const [showEnterAlias, setShowEnterAlias] = useState(false);
  const [channelResults, setChannelResults] = useState([]);
  const [channelLink, setChannelLink] = useState('');
  // refs
  const channelLinkInput = useRef('');
  // if show changes from false => true, then focus input
  useEffect(() => {
    if (show) {
      channelLinkInput.current.focus();
    }
  }, [show]);

  const resetState = () => {
    setShowChannelResults(false);
    setShowFindChannelByVideo(false);
    setShowOtherSocial(false);
    setShowEnterAlias(false);
    setChannelResults([]);
    setChannelLink('');
  };

  const handleNoYTVideo = () => {
    setShowChannelResults(false);
    setShowFindChannelByVideo(false);
    setShowOtherSocial(false);
    setShowEnterAlias(true);
  };

  const useFindChannelByVideo = () => {
    setShowChannelResults(false);
    setShowFindChannelByVideo(true);
    setShowOtherSocial(false);
    setShowEnterAlias(false);
  };

  const useOtherSocial = () => {
    setShowChannelResults(false);
    setShowFindChannelByVideo(false);
    setShowOtherSocial(true);
    setShowEnterAlias(false);
  };

  const addNewPerson = (person) => {
    handleAddNewPerson(person);
    resetState();
  };

  const analyzeChannelData = (newChannelLink, data) => {
    if (Array.isArray(data)) {
      setShowChannelResults(true);
      setShowFindChannelByVideo(false);
      setShowOtherSocial(false);
      setShowEnterAlias(false);
      setChannelLink(newChannelLink);
      setChannelResults(data);
    } else {
      addNewPerson(data);
    }
  };

  return (
    <Modal animation={false} restoreFocus={false} show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Person</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FindChannelByLink
          input={channelLinkInput}
          handleNoYTChannel={useOtherSocial}
          handleSubmit={analyzeChannelData}
        />
        <ChannelResults
          show={showChannelResults}
          data={channelResults}
          handleChannelFound={addNewPerson}
          handleChannelNotFound={useFindChannelByVideo}
        />
        <FindChannelByVideo
          show={showFindChannelByVideo}
          channelLink={channelLink}
          handleNoYTVideo={handleNoYTVideo}
          handleSubmit={addNewPerson}
        />
        <OtherSocial
          show={showOtherSocial}
          handleSubmit={addNewPerson}
        />
        <EnterAlias
          show={showEnterAlias}
          channelLink={channelLink}
          handleSubmit={addNewPerson}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddNewPersonDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  handleAddNewPerson: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddNewPersonDialog;
