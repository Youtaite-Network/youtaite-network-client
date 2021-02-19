import React, { useState, useContext, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Cookies from 'js-cookie'
import VideoDescription from './VideoDescription'
import SelectedBox from './SelectedBox'
import CollabLink from './CollabLink'
import PeopleForm from './PeopleForm'
import Video from './Video'
import AlertContext from '../AlertContext'

function Submit (props) {
  // state/context
  const [ytId, setYtId] = useState('')
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [title, setTitle] = useState('')
  const [byline, setByline] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState([])
  const [currentMiscId, setCurrentMiscId] = useState('')
  const [resetCollabLinkOnChange, setResetCollabLinkOnChange] = useState(false)
  const [random, setRandom] = useState(false)
  const { setAlert } = useContext(AlertContext)

  // refs
  const roleInput = useRef(null)

  useEffect(() => {
    const storedSelected = window.localStorage.getItem('selected')
    const storedCurrentMiscId = window.localStorage.getItem('currentMiscId')
    if (storedSelected && Cookies.get('access-token')) {
      setSelected(JSON.parse(storedSelected))
      setCurrentMiscId(storedCurrentMiscId)
      setShowSubmitForm(true)
    }
  }, [])

  const resetState = () => {
    if (random) {
      setShowSubmitForm(true)
      setSelected([])
      setCurrentMiscId('')
    } else {
      setYtId('')
      setShowSubmitForm(false)
      setTitle('')
      setByline('')
      setDescription('')
      setSelected([])
      setCurrentMiscId('')
    }
    setResetCollabLinkOnChange(!resetCollabLinkOnChange)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (window.confirm('Submit all roles?')) {
      axios.post('https://youtaite-network-api.herokuapp.com/submit', {
        people: selected,
        yt_id: ytId
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access-token')}`
        }
      })
        .then(response => {
          Cookies.set('access-token', response.headers['access-token'], {
            expires: new Date(response.headers['access-token-expiry'])
          })
        })
        .catch(error => {
          console.error(error)
        })
      setAlert(['remove-collab'])
      resetState()
    }
  }

  const removeCollab = e => {
    if (window.confirm('Are you sure? A collab is any video that involves the work of more than one youtaite.')) {
      axios.delete('https://youtaite-network-api.herokuapp.com/collabs', {
        data: { yt_id: ytId },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('access-token')}`
        }
      })
        .then(response => {
          Cookies.set('access-token', response.headers['access-token'], {
            expires: new Date(response.headers['access-token-expiry'])
          })
          setAlert(['remove-collab', 'Removed collab', 'info'])
        })
        .catch(error => {
          console.error(error)
          if (error.response && error.response.status === 400) {
            setAlert(['remove-collab', 'Did not remove collab - already has role associations', 'warning'])
          }
        })
      resetState()
    }
  }

  const useSubmitForm = (newTitle, newByline, newDescription, newYtId) => {
    if (window.localStorage.getItem('ytId') !== newYtId) {
      // if unchanged from localStorage, do not wipe selected
      setSelected([])
    }
    setShowSubmitForm(true)
    setTitle(newTitle)
    setByline(newByline)
    setDescription(newDescription)
    setYtId(newYtId)
    window.localStorage.setItem('ytId', newYtId)
  }

  const addPersonToSelected = newPerson => {
    if (!selected.find(person => person.misc_id === newPerson.misc_id)) {
      setSelected(selected.concat([newPerson]))
    }
    setCurrentMiscId(newPerson.misc_id)
    roleInput.current.focus()
  }

  const onRoleSuggestionSelected = newRole => {
    const index = selected.findIndex(person => currentMiscId === person.misc_id)
    let roles = []
    if (selected[index].roles) {
      // make copy of array to modify
      roles = [...selected[index].roles]
    }
    roles.push(newRole)
    const current = { ...selected[index], roles }
    setSelected(selected.slice(0, index)
      .concat([current])
      .concat(selected.slice(index + 1)))
  }

  const removePersonFromSelected = misc_id => {
    const index = selected.findIndex(person => person.misc_id === misc_id)
    const newSelected = selected.slice(0, index)
      .concat(selected.slice(index + 1))
    if (misc_id === currentMiscId) {
      if (newSelected.length > 0) {
        setCurrentMiscId(newSelected[newSelected.length - 1].misc_id)
      } else {
        setCurrentMiscId('')
      }
    }
    setSelected(newSelected)
  }

  const removeRoleFromSelected = (misc_id, roleToRemove) => {
    const personIndex = selected.findIndex(person => person.misc_id === misc_id)
    let newRoles = selected[personIndex].roles
    const roleIndex = newRoles.findIndex(role => role === roleToRemove)
    newRoles = newRoles.slice(0, roleIndex).concat(newRoles.slice(roleIndex + 1))
    setSelected(selected.slice(0, personIndex)
      .concat([{ ...selected[personIndex], roles: newRoles }])
      .concat(selected.slice(personIndex + 1)))
  }

  const currentPerson = selected.find(person => person.misc_id === currentMiscId)
  return (
    <div className='container mt-3'>
      <h2>Submit a Collab</h2>
      <p>Hi there! This form is not quite complete :) but feel free to mess around anyway! You'll need to sign in with Google before you can do anything though.</p>
      <Form onSubmit={handleSubmit}>
        <CollabLink onSubmit={useSubmitForm} resetOnChange={resetCollabLinkOnChange} setRandom={setRandom} random={random} />
        <div id='submit-form' className={showSubmitForm ? '' : 'd-none'}>
          <hr />
          <SelectedBox
            items={selected}
            current={currentMiscId}
            removePerson={removePersonFromSelected}
            removeRole={removeRoleFromSelected}
          />
          <PeopleForm
            roleInput={roleInput}
            show={showSubmitForm}
            handleSubmit={handleSubmit}
            removeCollab={removeCollab}
            onRoleSuggestionSelected={onRoleSuggestionSelected}
            currentPerson={currentPerson}
            addPersonToSelected={addPersonToSelected}
          />
          <hr />
          <Card className='clearfix' id='collab-info'>
            <Card.Header><a href={`https://youtube.com/watch?v=${ytId}`}>{title}</a></Card.Header>
            <Card.Body>
              <Video ytId={ytId} />
              <VideoDescription byline={byline} description={description} addPersonToSelected={addPersonToSelected} selected={selected} />
              <Button className='w-100 mt-2' variant='secondary' type='button' onClick={removeCollab}>
                Not a collab
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Form>
    </div>
  )
}

export default Submit
