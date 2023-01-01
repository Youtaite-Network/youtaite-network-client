import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import VideoDescription from './VideoDescription';
import SelectedBox from './SelectedBox';
import CollabLink from './CollabLink';
import PeopleForm from './PeopleForm';
import Video from './Video';
import AlertContext from '../AlertContext';
import networkApi from '../../utils/YoutaiteNetworkApi';

function Submit() {
  // state/context
  const [ytId, setYtId] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [title, setTitle] = useState('');
  const [byline, setByline] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState([]);
  const [currentMiscId, setCurrentMiscId] = useState('');
  const [resetCollabLinkOnChange, setResetCollabLinkOnChange] = useState(false);
  const [random, setRandom] = useState(false);
  const { setAlert } = useContext(AlertContext);

  // refs
  const roleInput = useRef(null);

  useEffect(() => {
    const storedSelected = window.localStorage.getItem('selected');
    const storedCurrentMiscId = window.localStorage.getItem('currentMiscId');
    if (storedSelected && Cookies.get('access-token')) {
      setSelected(JSON.parse(storedSelected));
      setCurrentMiscId(storedCurrentMiscId);
      setShowSubmitForm(true);
    }
  }, []);

  const resetState = () => {
    if (random) {
      setShowSubmitForm(true);
      setSelected([]);
      setCurrentMiscId('');
    } else {
      setYtId('');
      setShowSubmitForm(false);
      setTitle('');
      setByline('');
      setDescription('');
      setSelected([]);
      setCurrentMiscId('');
    }
    setResetCollabLinkOnChange(!resetCollabLinkOnChange);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Submit all roles?')) {
      networkApi.post('submit', {
        people: selected,
        yt_id: ytId,
      })
        .then((response) => networkApi.setAccessTokenCookie(response))
        .catch((error) => console.error(error));
      setAlert(['remove-collab']);
      window.localStorage.removeItem('selected');
      window.localStorage.removeItem('currentMiscId');
      window.localStorage.removeItem('ytId');
      resetState();
    }
  };

  const removeCollab = () => {
    if (window.confirm('Are you sure? A collab is any video that involves the work of more than one youtaite.')) {
      networkApi.delete('collabs', {
        data: { yt_id: ytId },
      })
        .then((response) => {
          networkApi.setAccessTokenCookie(response);
          setAlert(['remove-collab', 'Removed collab', 'info']);
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 400) {
            setAlert(['remove-collab', 'Did not remove collab - already has role associations', 'warning']);
          }
        });
      resetState();
    }
  };

  const useSubmitForm = (newTitle, newByline, newDescription, newYtId) => {
    if (window.localStorage.getItem('ytId') !== newYtId) {
      // if unchanged from localStorage, do not wipe selected
      setSelected([]);
    }
    setShowSubmitForm(true);
    setTitle(newTitle);
    setByline(newByline);
    setDescription(newDescription);
    setYtId(newYtId);
    window.localStorage.setItem('ytId', newYtId);
  };

  const addPersonToSelected = (newPerson) => {
    if (!selected.find((person) => person.misc_id === newPerson.misc_id)) {
      setSelected(selected.concat([newPerson]));
    }
    setCurrentMiscId(newPerson.misc_id);
    roleInput.current.focus();
  };

  const onRoleSuggestionSelected = (newRole) => {
    const index = selected.findIndex((person) => currentMiscId === person.misc_id);
    let roles = [];
    if (selected[index].roles) {
      // make copy of array to modify
      roles = [...selected[index].roles];
    }
    roles.push(newRole);
    const current = { ...selected[index], roles };
    setSelected(selected.slice(0, index)
      .concat([current])
      .concat(selected.slice(index + 1)));
  };

  const removePersonFromSelected = (miscId) => {
    const index = selected.findIndex((person) => person.misc_id === miscId);
    const newSelected = selected.slice(0, index)
      .concat(selected.slice(index + 1));
    if (miscId === currentMiscId) {
      if (newSelected.length > 0) {
        setCurrentMiscId(newSelected[newSelected.length - 1].misc_id);
      } else {
        setCurrentMiscId('');
      }
    }
    setSelected(newSelected);
  };

  const removeRoleFromSelected = (miscId, roleToRemove) => {
    const personIndex = selected.findIndex((person) => person.misc_id === miscId);
    let newRoles = selected[personIndex].roles;
    const roleIndex = newRoles.findIndex((role) => role === roleToRemove);
    newRoles = newRoles.slice(0, roleIndex).concat(newRoles.slice(roleIndex + 1));
    setSelected(selected.slice(0, personIndex)
      .concat([{ ...selected[personIndex], roles: newRoles }])
      .concat(selected.slice(personIndex + 1)));
  };

  const currentPerson = selected.find((person) => person.misc_id === currentMiscId);
  return (
    <div className="container mt-3">
      <h2>Submit a Collab</h2>
      <CollabLink
        onSubmit={useSubmitForm}
        resetOnChange={resetCollabLinkOnChange}
        setRandom={setRandom}
        random={random}
      />
      {showSubmitForm && (
        <div id="submit-form">
          <hr />
          <Form onSubmit={handleSubmit}>
            <SelectedBox
              items={selected}
              current={currentMiscId}
              removePerson={removePersonFromSelected}
              removeRole={removeRoleFromSelected}
            />
          </Form>
          <PeopleForm
            show={showSubmitForm}
            roleInput={roleInput}
            handleSubmit={handleSubmit}
            removeCollab={removeCollab}
            onRoleSuggestionSelected={onRoleSuggestionSelected}
            currentPerson={currentPerson}
            addPersonToSelected={addPersonToSelected}
          />
          <hr />
          <Card className="clearfix" id="collab-info">
            <Card.Header><a href={`https://youtube.com/watch?v=${ytId}`}>{title}</a></Card.Header>
            <Card.Body>
              <Video ytId={ytId} />
              <VideoDescription
                byline={byline}
                description={description}
                addPersonToSelected={addPersonToSelected}
                selected={selected}
              />
              <Button className="w-100 mt-2" variant="secondary" type="button" onClick={removeCollab}>
                Not a collab
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Submit;
