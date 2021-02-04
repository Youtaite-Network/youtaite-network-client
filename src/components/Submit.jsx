import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Linkify from 'react-linkify'
import axios from 'axios'
import Autosuggest from 'react-autosuggest'

const desc = `不思議だね 今の気持ち    空から降ってきたみたい

♪♪♪♪♪♪♪♪♪

Snow Halation, µ's first big hit and the first staple of the Love Live franchise, came out 10 years ago! To celebrate a decade of this amazing song, 23 people came together to pay tribute to Snow Halation! We hope you enjoy this huge cover and that this song is as special to you as it is to us!
µ'sic Forever~!\n

♪ CREDITS ♪

Vocals:
NINA (StarlightLily)
Bluebell
https://www.youtube.com/user/SGBluebe...​
https://twitter.com/SGBluebell​
Charity
https://www.youtube.com/channel/UCu-k...​
https://twitter.com/duckhime​ 
Eroc
https://www.twitter.com/MyNamesNotRic_​
Juudenki
https://www.youtube.com/JuudenkiJDK​
http://www.twitter.com/JuudenkiJDK​
Kelsey
https://www.youtube.com/channel/UCAA4...​
https://twitter.com/hoover_kelsey​
Lu
https://www.youtube.com/illuim​
http://www.twitter.com/ymnatweet​
Lunarveil
https://www.youtube.com/c/lunarveil​
http://www.twitter.com/lunarveil​
magic
https://youtube.com/channel/UCsWGFTZ5...​
https://twitter.com/magicheresy​
Mathew
https://www.youtube.com/c/SepiaDaysMusic​
https://www.twitter.com/MathewSepiaDays​
miyukii
https://www.youtube.com/c/miyukii​
Moment
https://m.youtube.com/channel/UCjKfDP...​
https://twitter.com/mmomentlive?lang=en​
Rice
https://youtube.com/user/The11timbit​
https://www.twitter.com/rice_covers​
Riika Riika Rii
https://youtube.com/user/Inlinverst​
https://twitter.con/RiikaRiikaRii​
Sai
https://youtube.com/c/Saicecream​
https://twitter.com/sai_pyon?s=21​
TrueCrayon
https://youtube.com/channel/UCAdBWXIk...​
https://mobile.twitter.com/thetruestc...​
Wooly
https://youtube.com/channel/UCoDeGl8J...​
http://www.twitter.com/loliwooly​
xillball
https://www.youtube.com/c/xillball/fe...​
https://twitter.com/xillball​
Zaya
https://twitter.com/ladynalenthi​
https://youtube.com/nalenthi​
リリサ 
https://www.youtube.com/c/sproutseason​
https://twitter.com/sproutseasons​
ゆたかた
https://youtube.com/channel/UCbmHCgjX...​
https://twitter.com/eri_kurezu?s=09​
열.
https://youtube.com/YEOLTHEK​
https://twitter.com/YEOLTHEK​

Mix:
Mars
https://twitter.com/Hinokamimars​

Art:
Riika Riika Rii
NINA

Video:
Moment
Zaya
NINA

Harmony arrangement:
NINA

Timing:
NINA

Tuning:
TrueCrayon
NINA

Original song:
Snow Halation

Original singers: 
μ's
Honoka Kousaka (CV: Emi Nitta)
Kotori Minami (CV: Aya Uchida)
Umi Sonoda (CV: Suzuko Mimori)
Rin Hoshizora (CV: Riho Iida)
Hanayo Koizumi (CV: Yurika Kubo)
Maki Nishikino (CV: Pile)
Nozomi Tojo (CV: Aina Kusuda)
Nico Yazawa (CV: Sora Tokui)
Eli Ayase (CV: Yoshino Nanjo)

Written by:
Aki Hata

Composed by:
Takahiro Yamada

Arranged by:
Ryousuke Nakanishi

Release date:
2010



♪ MY SOCIAL MEDIA ♪

Twitter: 
@27_orange_lily

Instagram: 
@27_orange_lily

Tumblr: 
starlightlily-art

Gay Muse Soundcloud: 
Gay Muse Official
Gay Muse Solo Live`

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
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
    this.roleInput = React.createRef()
    this.personInput = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.switchToSubmitForm = this.switchToSubmitForm.bind(this)
    this.handlePersonChange = this.handlePersonChange.bind(this)
    this.onPersonSuggestionSelected = this.onPersonSuggestionSelected.bind(this)
    this.onPersonSuggestionsFetchRequested = this.onPersonSuggestionsFetchRequested.bind(this)
    this.onPersonSuggestionsClearRequested = this.onPersonSuggestionsClearRequested.bind(this)
    this.handleRoleChange = this.handleRoleChange.bind(this)
    this.onRoleSuggestionSelected = this.onRoleSuggestionSelected.bind(this)
    this.onRoleSuggestionsFetchRequested = this.onRoleSuggestionsFetchRequested.bind(this)
    this.onRoleSuggestionsClearRequested = this.onRoleSuggestionsClearRequested.bind(this)
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
    console.log(e)
  }

  handleLinkChange(e) {
    this.setState({link: e.target.value})
  }

  switchToSubmitForm(e) {
    console.log(e)
    // call youtaite-network-api.herokuapp.com to get:
    // Title, Description
    this.setState({
      analyzed: true,
      title: 'Title placeholder',
      description: desc,
    })
    // display title, desc
    // insert new form inputs
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

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getPersonSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0 ? [] : this.state.people.filter(person =>
      person.name.toLowerCase().slice(0, inputLength) === inputValue
    )
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onPersonSuggestionsFetchRequested({ value }) {
    this.setState({
      personSuggestions: this.getPersonSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onPersonSuggestionsClearRequested() {
    this.setState({
      personSuggestions: []
    });
  };

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

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onRoleSuggestionsFetchRequested({ value }) {
    this.setState({
      roleSuggestions: this.getRoleSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onRoleSuggestionsClearRequested() {
    this.setState({
      roleSuggestions: []
    });
  };

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

  render() {

    const { personInputValue, personSuggestions, roleInputValue, roleSuggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const personInputProps = {
      placeholder: 'Type an alias',
      value: personInputValue,
      onChange: this.handlePersonChange,
      className: 'form-control',
      id: 'person-input',
      ref: this.personInput,
    };

    const roleInputProps = {
      placeholder: 'Type a role',
      value: roleInputValue,
      onChange: this.handleRoleChange,
      className: 'form-control',
      id: 'role-input',
      ref: this.roleInput,
    }

    return (<div className='container mt-3'>
      <h2>Submit a Collab</h2>
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
            <Card.Header>Type alias, press enter, type role(s), press enter, rinse & repeat!</Card.Header>
            <Card.Body>
              <Form.Row className='mb-2'>
                <Col>
                  <Autosuggest
                    suggestions={personSuggestions}
                    onSuggestionsFetchRequested={this.onPersonSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onPersonSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderPersonSuggestion}
                    inputProps={personInputProps}
                    onSuggestionSelected={this.onPersonSuggestionSelected}
                    highlightFirstSuggestion={true}
                  />
                </Col>
                <Col>
                  <Autosuggest
                    suggestions={roleSuggestions}
                    onSuggestionsFetchRequested={this.onRoleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onRoleSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderRoleSuggestion}
                    inputProps={roleInputProps}
                    onSuggestionSelected={this.onRoleSuggestionSelected}
                    highlightFirstSuggestion={true}
                  />
                </Col>
              </Form.Row>
              <Button variant="primary" type="submit" className="w-100">
                Submit All
              </Button>
            </Card.Body>
          </Card>
          <hr></hr>
          <Form.Group className="clearfix" id="collab-info">
            <a href={this.state.link}><h3>{this.state.title}</h3></a>
            <div 
              className="float-right mr-3 responsive-iframe-container" 
              style={{width: '40%', paddingTop: (40*9/16) + '%'}}>
              <iframe 
                className="responsive-iframe"
                width="560" height="315" 
                src="https://www.youtube.com/embed/ORVH8rl6WFo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen></iframe>
            </div>
            <VideoDescription text={this.state.description}></VideoDescription>
          </Form.Group>
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