import React from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import axios from 'axios'
import getVideoId from 'get-video-id'
import Cookies from 'js-cookie'
import VideoDescription from './VideoDescription'
import SelectedBox from './SelectedBox'
import CollabLink from './CollabLink'
import PeopleForm from './PeopleForm'
import Video from './Video'

class Submit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ytId: '',
      showSubmitForm: false,
      title: '',
      byline: '',
      thumbnail: '',
      description: '',
      selected: [],
      currentMiscId: '',
      resetCollabLinkOnChange: false,
    }

    // general event handlers
    this.handleSubmit = this.handleSubmit.bind(this)
    this.useSubmitForm = this.useSubmitForm.bind(this)
    this.addPersonToSelected = this.addPersonToSelected.bind(this)
    this.onRoleSuggestionSelected = this.onRoleSuggestionSelected.bind(this)
    this.removePersonFromSelected = this.removePersonFromSelected.bind(this)
    this.removeRoleFromSelected = this.removeRoleFromSelected.bind(this)
  }

  resetState() {
    this.setState(prevState => {
      return {
        ytId: '',
        showSubmitForm: false,
        title: '',
        byline: '',
        thumbnail: '',
        description: '',
        selected: [],
        currentMiscId: '',
        resetCollabLinkOnChange: !prevState.resetCollabLinkOnChange,
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    if(window.confirm('Submit all roles?')) {
      axios.post('https://youtaite-network-api.herokuapp.com/submit', {
        people: this.state.selected,
        yt_id: this.state.ytId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access-token')}`
        },
      })
        .then(response => {
          Cookies.set('access-token', response.headers['access-token'], {
            expires: new Date(response.headers['expiry'])
          })
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
      this.resetState()
    }
  }

  handleLinkChange(e) {
    this.setState({link: e.target.value})
  }

  useSubmitForm(collabLink) {
    // get youtube video ID
    let id = collabLink
    let service = 'youtube'
    let match = id.match(/[\w\d-_]{11}/g)
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
        'Authorization': `Bearer ${Cookies.get('access-token')}`
      }
    })
      .then(response => {
        // set cookies
        Cookies.set('access-token', response.headers['access-token'], {
          expires: new Date(response.headers['expiry'])
        })
        let {title, description, channel_id} = response.data
        axios(`https://youtaite-network-api.herokuapp.com/people/info/${channel_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access-token')}`
          }
        })
          .then(response => {
            // set cookies
            Cookies.set('access-token', response.headers['access-token'], {
              expires: new Date(response.headers['expiry'])
            })
            let {name} = response.data
            let byline = `posted by: ${name} (https://youtube.com/channel/${channel_id})`
            this.setState({
              showSubmitForm: true,
              title,
              byline,
              description,
              ytId: id,
            })
          })
      })
      .catch(error => console.log(error))
  }

  addPersonToSelected(newPerson) {
    this.setState(prevState => {
      let newSelected = prevState.selected
      if (!prevState.selected.find(person => person.misc_id === newPerson.misc_id)) {
        newSelected = prevState.selected.concat([newPerson])
      }
      return {
        selected: newSelected,
        currentMiscId: newPerson.misc_id,
      }
    })
  }

  onRoleSuggestionSelected(newRole) {
    this.setState(function(prevState) {
      let index = prevState.selected.findIndex(person => prevState.currentMiscId === person.misc_id)
      let roles = []
      if (prevState.selected[index].roles) {
        // make copy of array to modify
        roles = [...prevState.selected[index].roles]
      }
      roles.push(newRole)
      let current = {...prevState.selected[index], roles}
      return {
        selected: prevState.selected.slice(0, index)
          .concat([current])
          .concat(prevState.selected.slice(index + 1)),
      }
    })
  }

  removePersonFromSelected(misc_id) {
    this.setState(prevState => {
      let index = prevState.selected.findIndex(person => person.misc_id === misc_id)
      let newSelected = prevState.selected.slice(0, index)
          .concat(prevState.selected.slice(index + 1))
      let newMiscId = prevState.currentMiscId
      if (misc_id === prevState.currentMiscId) {
        if (newSelected.length > 0) {
          newMiscId = newSelected[newSelected.length - 1].misc_id
        } else {
          newMiscId = ''
        }
      }
      return {
        selected: newSelected,
        currentMiscId: newMiscId,
      }
    })
  }

  removeRoleFromSelected(misc_id, roleToRemove) {
    this.setState(prevState => {
      let personIndex = prevState.selected.findIndex(person => person.misc_id === misc_id)
      let newRoles = prevState.selected[personIndex].roles
      if (newRoles) {
        let roleIndex = newRoles.findIndex(role => role === roleToRemove)
        newRoles = newRoles.slice(0, roleIndex).concat(newRoles.slice(roleIndex + 1))
      }
      return {
        selected: prevState.selected.slice(0, personIndex)
          .concat([{...prevState.selected[personIndex], roles: newRoles}])
          .concat(prevState.selected.slice(personIndex + 1))
      }
    })
  }

  render() {
    const currentPerson = this.state.selected.find(person => person.misc_id === this.state.currentMiscId)
    return (
      <div className='container mt-3'>
        <h2>Submit a Collab</h2>
        <p>Hi there! This form is not quite complete :) but feel free to mess around anyway! You'll need to sign in with Google before you can do anything though.</p>
        <Form onSubmit={this.handleSubmit}>
          <CollabLink handleClick={this.useSubmitForm} resetOnChange={this.state.resetCollabLinkOnChange} />
          <div id="submit-form" style={{display: this.state.showSubmitForm ? 'block' : 'none'}}>
            <hr/>
            <SelectedBox 
              items={this.state.selected} 
              current={this.state.currentMiscId}
              removePerson={this.removePersonFromSelected}
              removeRole={this.removeRoleFromSelected} />
            <PeopleForm
              show={this.state.showSubmitForm}
              handleSubmit={this.handleSubmit}
              onRoleSuggestionSelected={this.onRoleSuggestionSelected}
              currentPerson={currentPerson}
              addPersonToSelected={this.addPersonToSelected} />
            <hr/>
            <Card className="clearfix" id="collab-info">
              <Card.Header><a href={`https://youtube.com/watch?v=${this.state.ytId}`}>{this.state.title}</a></Card.Header>
              <Card.Body>
                <Video ytId={this.state.ytId} />
                <VideoDescription byline={this.state.byline} description={this.state.description} />
              </Card.Body>
            </Card>
          </div>
        </Form>
      </div>
    )
  }
}

export default Submit
