import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Linkify from 'react-linkify'
import axios from 'axios'
import Autosuggest from 'react-autosuggest'
import getVideoId from 'get-video-id'
import Cookies from 'js-cookie'

// Autosuggest: rendering person suggestions
const renderPersonSuggestion = suggestion => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div>
      <Image className="mr-1" width="40px" height="40px" roundedCircle src={suggestion.thumbnail} />
    </div>
    <div className="ml-1 text-truncate"><strong>
      {suggestion.name}
    </strong></div>
  </div>
);

// Autosuggest: rendering role suggestions
const renderRoleSuggestion = suggestion => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div className="ml-1 text-truncate"><strong>
      {suggestion.name}
    </strong></div>
  </div>
)

class Submit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      link: '',
      ytId: '',
      analyzed: false,
      title: '',
      thumbnail: '',
      description: '',
      people: [],
      selected: [],
      roles: [
        {name: 'art'},
        {name: 'guide'},
        {name: 'lyrics'},
        {name: 'mix'},
        {name: 'organize'},
        {name: 'translate'},
        {name: 'video'},
        {name: 'vocal'},
        {name: 'misc'},
      ],
      personInputValue: '',
      personSuggestions: [],
      mostRecentPersonId: -1,
      roleInputValue: '',
      roleSuggestions: [],
    }
    // refs
    this.roleInput = React.createRef()
    this.personInput = React.createRef()
    // general event handlers
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.switchToSubmitForm = this.switchToSubmitForm.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    // person input event handlers
    this.handlePersonChange = this.handlePersonChange.bind(this)
    this.onPersonSuggestionSelected = this.onPersonSuggestionSelected.bind(this)
    this.onPersonSuggestionsFetchRequested = this.onPersonSuggestionsFetchRequested.bind(this)
    this.onPersonSuggestionsClearRequested = this.onPersonSuggestionsClearRequested.bind(this)
    this.handlePersonKeyDown = this.handlePersonKeyDown.bind(this)
    // role input event handlers
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.onRoleSuggestionSelected = this.onRoleSuggestionSelected.bind(this)
    this.onRoleSuggestionsFetchRequested = this.onRoleSuggestionsFetchRequested.bind(this)
    this.onRoleSuggestionsClearRequested = this.onRoleSuggestionsClearRequested.bind(this)
    this.handleRoleKeyDown = this.handleRoleKeyDown.bind(this)
  }

  componentDidMount() {
    axios('https://youtaite-network-api.herokuapp.com/people')
      .then(response => {
        let people = response.data
        people.push({name: 'Add new person', misc_id: ''})
        this.setState({
          people,
        })
      })
      .catch(error => console.log(error))
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
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  handleLinkChange(e) {
    this.setState({link: e.target.value})
  }

  switchToSubmitForm(e) {
    // get youtube video ID
    let id = this.state.link
    let service = 'youtube'
    if (!(id.match(/[\w\d-_]{11}/g)[0] === id)) {
      ({id, service} = getVideoId(this.state.link))
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
        let {title, description} = response.data
        this.setState({
          analyzed: true,
          title,
          description,
          ytId: id,
        })
      })
      .catch(error => console.log(error))
      .then(() => this.personInput.current.focus())
  }

  // Autosuggest: how to convert a suggestion to text
  getSuggestionValue(suggestion){
    return suggestion.name
  }

  handlePersonChange(e, {newValue}) {
    this.setState({
      personInputValue: newValue,
    })
  }

  handleRoleChange(e, {newValue}) {
    this.setState({
      roleInputValue: newValue,
    })
  }

  // Autosuggest: calculate person suggestions for any given input value
  getPersonSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0 ? [] : this.state.people.filter(person =>
      person.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  // Autosuggest: update person suggestions
  onPersonSuggestionsFetchRequested({ value }) {
    this.setState({
      personSuggestions: this.getPersonSuggestions(value)
    });
  };

  // Autosuggest: clear person suggestions
  onPersonSuggestionsClearRequested() {
    this.setState({
      personSuggestions: []
    });
  };

  // Autosuggest: what to do when person suggestion is selected
  onPersonSuggestionSelected(e, { suggestion }) {
    this.setState(function(prevState) {
      let newSelected = null
      if (prevState.selected.find(person => person.id === suggestion.id)) {
        newSelected = prevState.selected
      } else {
        newSelected = prevState.selected.concat([suggestion])
      }
      return {
        personInputValue: '',
        selected: newSelected,
        mostRecentPersonId: suggestion.id,
      }
    })
    this.roleInput.current.focus()
  }

  // Auosuggest: calculate role suggestions based on input
  getRoleSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    let mostRecent = this.state.selected.find(person => person.id === this.state.mostRecentPersonId)
    let availableRoles = this.state.roles
    if (mostRecent.roles) {
      availableRoles = this.state.roles.filter(role => !mostRecent.roles.includes(role.name))
    }
    return inputLength === 0 ? [] : availableRoles.filter(role =>
      role.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  // Autosuggest: update role suggestions
  onRoleSuggestionsFetchRequested({ value }) {
    this.setState({
      roleSuggestions: this.getRoleSuggestions(value)
    });
  };

  // Autosuggest: clear role suggestions
  onRoleSuggestionsClearRequested() {
    this.setState({
      roleSuggestions: []
    });
  };

  // Autosuggest: what to do when role suggestion is selected
  onRoleSuggestionSelected(e, { suggestion }) {
    this.setState(function(prevState) {
      let index = prevState.selected.findIndex(person => prevState.mostRecentPersonId === person.id)
      let roles = []
      if (prevState.selected[index].roles) {
        // make copy of array to modify
        roles = [...prevState.selected[index].roles]
      }
      roles.push(suggestion.name)
      let mostRecent = {...prevState.selected[index], roles}
      return {
        roleInputValue: '',
        selected: prevState.selected.slice(0, index)
          .concat([mostRecent])
          .concat(prevState.selected.slice(index + 1))
      }
    })
  }

  // event handler: switch to roleInput when cmd/ctrl-enter is pressed in personInput
  handlePersonKeyDown(e) {
    if (e.key === 'Enter' && e.metaKey === true) {
      this.roleInput.current.focus()
    }
  }

  // event handler: switch to personInput when cmd/ctrl-enter is pressed in roleInput
  handleRoleKeyDown(e) {
    if (e.key === 'Enter' && e.metaKey === true) {
      this.personInput.current.focus()
    }
  }

  render() {

    const { personInputValue, personSuggestions, roleInputValue, roleSuggestions } = this.state;

    // Autosuggest: input props for personInput
    const personInputProps = {
      placeholder: 'Yuki',
      value: personInputValue,
      onChange: this.handlePersonChange,
      onKeyDown: this.handlePersonKeyDown,
      className: 'form-control',
      id: 'person-input',
      ref: this.personInput,
    };
    // Autosuggest: input props for roleInput
    const roleInputProps = {
      placeholder: 'organize',
      value: roleInputValue,
      onChange: this.handleRoleChange,
      onKeyDown: this.handleRoleKeyDown,
      className: 'form-control',
      id: 'role-input',
      ref: this.roleInput,
      readOnly: this.state.mostRecentPersonId < 0,
    }

    return (<div className='container mt-3'>
      <h2>Submit a Collab</h2>
      <p>Hi there! This form is not fully functional yet :) If you still want to try it out, you first need to sign in and then you can test it out. Be warned, any errors are generally not presented in a user-friendly way right now. So it might be helpful to open up browser devtools and check for errors there, if you want to know what's gone wrong!</p>
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="link-form">
          <Form.Group controlId="form-yt-link">
            <Form.Label>YouTube link</Form.Label>
            <Form.Control 
              type="yt_link" 
              placeholder="https://youtube.com/watch?v=XXXXXX" 
              value={this.state.link} 
              onChange={this.handleLinkChange}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={this.switchToSubmitForm}>
            Analyze Link
          </Button>
        </Form.Group>
        <div id="submit-form" style={{display: this.state.analyzed ? 'block' : 'none'}}>
          <hr></hr>
          <SelectedBox items={this.state.selected} mostRecent={this.state.mostRecentPersonId}></SelectedBox>
          <Card className="sticky-top mb-3" bg="light">
            <Card.Header>{'Press enter or click to select an option. Cmd/ctrl-enter switches between the two inputs.'}</Card.Header>
            <Card.Body>
              <Form.Row className='mb-2'>
                <Col>
                  <Autosuggest
                    suggestions={personSuggestions}
                    onSuggestionsFetchRequested={this.onPersonSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onPersonSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={renderPersonSuggestion}
                    inputProps={personInputProps}
                    onSuggestionSelected={this.onPersonSuggestionSelected}
                    focusInputOnSuggestionClick={false}
                    highlightFirstSuggestion={true}
                  />
                </Col>
                <Col>
                  <Autosuggest
                    suggestions={roleSuggestions}
                    onSuggestionsFetchRequested={this.onRoleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onRoleSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={renderRoleSuggestion}
                    inputProps={roleInputProps}
                    onSuggestionSelected={this.onRoleSuggestionSelected}
                    highlightFirstSuggestion={true}
                  />
                </Col>
              </Form.Row>
              <Button variant="primary" type="button" onClick={this.handleSubmit} className="w-100">
                Submit All
              </Button>
            </Card.Body>
          </Card>
          <hr></hr>
          <Card className="clearfix" id="collab-info">
            <Card.Header><a href={this.state.link}>{this.state.title}</a></Card.Header>
            <Card.Body>
              <div 
                className="float-right mr-3 responsive-iframe-container" 
                style={{width: '40%', paddingTop: (40*9/16) + '%'}}>
                <iframe 
                  title="yt-embed"
                  className="responsive-iframe"
                  width="560" height="315" 
                  src={`https://youtube.com/embed/${this.state.ytId}`} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen></iframe>
              </div>
              <VideoDescription text={this.state.description}></VideoDescription>
            </Card.Body>
          </Card>
        </div>
      </Form>
    </div>);
  }
}

function VideoDescription(props) {
  const text = props.text
  let itemsArray = []
  text.split("\n").forEach((line, i) => {
    itemsArray.push(<span key={`span-${i.toString()}`}>{line}</span>)
    itemsArray.push(<br key={`br-${i.toString()}`}/>)
  })
  return (
    <Linkify className="d-inline">
      {itemsArray}
    </Linkify>
  )
}

function SelectedBox(props) {
  const items = props.items
  const mostRecent = props.mostRecent
  let itemsArray = []
  items.forEach((item, i) => {
    let border = 'null'
    if (item.id === mostRecent) {
      border = 'danger'
    }
    itemsArray.push(
      <Card className="row flex-row align-items-center flex-nowrap p-1 m-1" 
        bg="light" text="dark" border={border} key={`selected-${i}`}>
        <div>
          <Image className="mr-1" width="40px" height="40px" roundedCircle src={item.thumbnail} />
        </div>
        <div className="mx-1 d-flex flex-column text-truncate">
          <strong>
            {item.name}
          </strong>
          <span>
            <i>
              {item.roles ? item.roles.join(',') : 'no roles yet.'}
            </i>
          </span>
        </div>
      </Card>
    )
  })
  return (
    <Card bg="light" className={'mb-3 ' + (items.length > 0 ? '' : 'd-none')}>
      <Card.Header>Selected people:</Card.Header>
      <Card.Body>
        <div className="d-flex flex-wrap">
          {itemsArray}
        </div>
      </Card.Body>
    </Card>
  )
}

export default Submit