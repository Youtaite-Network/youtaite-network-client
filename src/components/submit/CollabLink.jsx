import React, { useState, useContext, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import getVideoId from 'get-video-id'
import axios from 'axios'
import Cookies from 'js-cookie'
import AlertContext from '../AlertContext'

function CollabLink(props) {
  const onSubmit = props.onSubmit
  const resetOnChange = props.resetOnChange
  const [collabLink, setCollabLink] = useState('')
  const { setAlert } = useContext(AlertContext)

  // refs
  const defaultButton = useRef(null)
  const input = useRef(null)

  useEffect(() => {
    setCollabLink('')
    input.current.focus()
  }, [resetOnChange])

  const handleCollabLinkChange = e => {
    setCollabLink(e.target.value)
  }

  const handleClick = e => {
    if (!collabLink) {
      setAlert({ message: 'Enter a Youtube video first', variant: 'info' })
      input.current.focus()
      return
    }
    // get YT video ID
    let id = collabLink
    let service = 'youtube'
    const match = id.match(/[\w\d-_]{11}/g)
    if (match && match[0] !== id) {
      ({id, service} = getVideoId(collabLink))
    }
    if (service !== 'youtube') {
      console.error('Could not parse URL. Make sure it is a valid Youtube URL and not a shortened/redirect URL (eg, bitly)')
      return
    }
    // call youtaite-network-api.herokuapp.com to get title & description from ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/info/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access-token')}`,
      }
    })
      .then(response => {
        // set cookies
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
        let {title, description, channel_id} = response.data
        // get info about channel that posted collab
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channel_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access-token')}`,
          }
        })
          .then(response => {
            // set cookies
            Cookies.set('access-token', response.headers['access-token'], {
              expires: new Date(response.headers['expiry'])
            })
            console.log(response.data)
            let {name} = response.data
            let byline = `posted by: ${name} (https://youtube.com/channel/${channel_id})`
            onSubmit(title, byline, description, id)
            setAlert({ message: '', variant: '' })
          }).catch(error => {
            console.error(error)
          })
      }).catch(error => {
        console.error(error)
        if (error.response) {
          if (error.response.status === 403) {
            setAlert({ message: 'Please sign in', variant: 'danger' })
          }
        }
      })
  }

  const getRandom = e => {
    // call youtaite-network-api.herokuapp.com to get title & description from ID
    axios(`https://youtaite-network-api.herokuapp.com/collabs/new_random`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('access-token')}`,
      }
    })
      .then(response => {
        // set cookies
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
        let {yt_id, title, description, channel_id} = response.data
        // get info about channel that posted collab
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channel_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access-token')}`,
          }
        })
          .then(response => {
            // set cookies
            Cookies.set('access-token', response.headers['access-token'], {
              expires: new Date(response.headers['expiry'])
            })
            let {name} = response.data
            let byline = `posted by: ${name} (https://youtube.com/channel/${channel_id})`
            onSubmit(title, byline, description, yt_id)
            setAlert({ message: '', variant: '' })
          }).catch(error => {
            console.error(error)
          })
      }).catch(error => {
        console.error(error)
        if (error.response) {
          if (error.response.status === 403) {
            setAlert({ message: 'Please sign in', variant: 'danger' })
          }
        }
      })
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      defaultButton.current.click()
    }
  }

  return (
    <Form.Group>
      <div className="m-1">
        <Form.Label>YouTube video link</Form.Label>
        <Form.Control 
          type="yt_link" 
          placeholder="https://youtube.com/watch?v=XXXXXX" 
          value={collabLink} 
          onChange={handleCollabLinkChange}
          onKeyDown={handleKeyDown}
          ref={input}
        />
      </div>
      <Button className="m-1" ref={defaultButton} variant="primary" onClick={handleClick}>
        Analyze link
      </Button>
      <Button className="m-1" variant="info" onClick={getRandom}>
        I'm feeling lucky
      </Button>
    </Form.Group>
  );
}

export default CollabLink;


