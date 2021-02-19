import React, { useState, useRef, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function UseOtherSocial ({ show, handleSubmit }) {
  // state/context
  const [alias, setAlias] = useState('')
  const [socialLink, setSocialLink] = useState('')

  // refs
  const igRadio = useRef(null)
  const fbRadio = useRef(null)
  const scRadio = useRef(null)
  const tumblrRadio = useRef(null)
  const otherRadio = useRef(null)
  const input = useRef(null)

  // if show changed from false => true, focus input
  useEffect(() => {
    if (show) {
      input.current.focus()
    }
  }, [show])

  const handleAliasChange = e => {
    setAlias(e.target.value)
  }

  const handleSocialLinkChange = e => {
    setSocialLink(e.target.value)
  }

  const handleAdd = e => {
    let link = socialLink
    if (link.startsWith('http')) { // remove protocol
      const url = new URL(link)
      link = `${url.hostname}${url.pathname}`
    }
    const person = {}
    person.thumbnail = '#'
    person.name = alias
    person.misc_id = link

    if (socialLink === '') {
      person.misc_id = alias
      person.id_type = 'no_link'
    } else if (igRadio.current.checked) {
      person.id_type = 'ig'
    } else if (fbRadio.current.checked) {
      person.id_type = 'fb'
    } else if (scRadio.current.checked) {
      person.id_type = 'soundcloud'
    } else if (tumblrRadio.current.checked) {
      person.id_type = 'tumblr'
    } else {
      person.id_type = 'other'
    }
    handleSubmit(person)
  }

  return (
    <div className={show ? '' : 'd-none'}>
      <hr />
      <Form.Group>
        <Form.Label>Enter alias</Form.Label>
        <Form.Control
          type='alias'
          placeholder='Alias'
          value={alias}
          onChange={handleAliasChange}
          ref={input}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Enter another social link (blank if none)</Form.Label>
        <Form.Control
          type='social_link'
          placeholder='https://instagram.com/XXXXX'
          value={socialLink}
          onChange={handleSocialLinkChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Check
          id='ig-radio'
          type='radio'
          label='instagram'
          name='social-type'
          ref={igRadio}
        />
        <Form.Check
          id='fb-radio'
          type='radio'
          label='facebook'
          name='social-type'
          ref={fbRadio}
        />
        <Form.Check
          id='sc-radio'
          type='radio'
          label='soundcloud'
          name='social-type'
          ref={scRadio}
        />
        <Form.Check
          id='tumblr-radio'
          type='radio'
          label='tumblr'
          name='social-type'
          ref={tumblrRadio}
        />
        <Form.Check
          id='other-radio'
          type='radio'
          label='other/no link'
          name='social-type'
          defaultChecked
          ref={otherRadio}
        />
      </Form.Group>
      <Button
        className='ml-1' variant='primary'
        onClick={handleAdd}
        disabled={alias.length === 0}
      >
        Add
      </Button>
    </div>
  )
}

export default UseOtherSocial
