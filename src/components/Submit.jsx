import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
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
const getSuggestionValue = suggestion => suggestion.misc_id;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.misc_id}
  </div>
);

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
      roles: [
        'art',
        'guide',
        'lyrics',
        'misc',
        'mix',
        'organize',
        'translate',
        'video',
        'vocal',
      ],
      rolesInputValue: '',
      suggestions: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.handleRolesChange = this.handleRolesChange.bind(this)
    this.handleRolesKeyUp = this.handleRolesKeyUp.bind(this)
    this.switchToSubmitForm = this.switchToSubmitForm.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.onSuggestionHighlighted = this.onSuggestionHighlighted.bind(this)
  }

  componentDidMount() {
    axios('https://youtaite-network-api.herokuapp.com/people')
      .then(response => {
        let people = response.data
        people.push({misc_id: 'Add new person'})
        this.people = people
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

  handleRolesChange(e, {newValue}) {
    this.setState({
      rolesInputValue: newValue,
    })
  }

  handleRolesKeyUp(e) {
    console.log(e)
  }

  // Teach Autosuggest how to calculate suggestions for any given input value.
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.people.filter(person =>
      person.misc_id.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected(e) {
    console.log(e)
  }

  onSuggestionHighlighted({suggestion}) {
    console.log(suggestion)
  }

  render() {

    const { rolesInputValue, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Type a programming language',
      value: rolesInputValue,
      onChange: this.handleRolesChange,
      className: 'form-control',
    };

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
          <Form.Group className="clearfix" id="collab-info">
            <a href={this.state.link}><h3>{this.state.title}</h3></a>
            <div 
              className="float-left mr-3 responsive-iframe-container" 
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
          <Card className="fixed-bottom container bg-light p-3 mb-2" border="secondary">
            <Form.Group className="" controlId="form-roles">
              <Form.Label>Enter name, tab or enter, enter role, rinse & repeat!</Form.Label>
              {/* <Form.Control */}
              {/*   type="roles" */}
              {/*   value={this.state.roles} */}
              {/*   onChange={this.handleRolesChange} */}
              {/*   onKeyUp={this.handleRolesKeyUp}/> */}
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                // onSuggestionSelected={this.onSuggestionSelected}
                // onSuggestionHighlighted={this.onSuggestionHighlighted}
                // highlightFirstSuggestion={true}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit All
            </Button>
          </Card>
        </div>
      </Form>
    </div>);
  }
}

function VideoDescription(props) {
  const text = props.text
  let listItems = []
  text.split("\n").forEach((line, i) => {
    listItems.push(<span key={`span-${i.toString()}`}>{line}</span>)
    listItems.push(<br key={`br-${i.toString()}`}/>)
  })
  return (
    <Linkify className="d-inline">
      {listItems}
    </Linkify>
  )
}

export default Submit