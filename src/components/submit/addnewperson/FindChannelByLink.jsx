import React, { useState, useRef } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function FindChannelByLink ({ handleNoYTChannel, handleSubmit, input }) {
  const [channelLink, setChannelLink] = useState('')
  const defaultButton = useRef(null)

  const handleChannelLinkChange = e => {
    setChannelLink(e.target.value)
  }

  const analyzeChannelLink = e => {
    let link = channelLink
    if (link.startsWith('http')) { // remove protocol
      const url = new URL(link)
      link = `${url.hostname}${url.pathname}`
    }

    axios(`https://youtaite-network-api.herokuapp.com/people/info_from_url/${link}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('access-token')}`
      }
    })
      .then(response => {
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['access-token-expiry'])
        })
        handleSubmit(channelLink, response.data)
      })
      .catch(response => {
        console.error(response)
      })
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      defaultButton.current.click()
    }
  }

  return (
    <Form.Group>
      <Form.Group>
        <Form.Label>Link (Youtube or Twitter)</Form.Label>
        <Form.Control
          type='channel_link'
          placeholder='https://youtube.com/channel/XXXXXXXXX'
          value={channelLink}
          onChange={handleChannelLinkChange}
          onKeyDown={handleKeyDown}
          ref={input}
        />
      </Form.Group>
      <Button className='mr-1' variant='secondary' onClick={handleNoYTChannel}>
        No YT or TW link available
      </Button>
      <Button ref={defaultButton} className='ml-1' variant='primary' disabled={channelLink.length === 0} onClick={analyzeChannelLink}>
        Analyze link
      </Button>
    </Form.Group>
  )
}

export default FindChannelByLink
