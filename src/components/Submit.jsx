import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Linkify from 'react-linkify';
import axios from 'axios'

let desc = `不思議だね 今の気持ち    空から降ってきたみたい

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

class Submit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      link: '',
      analyzed: false,
      title: '',
      thumbnail: '',
      description: [],
      personOptions: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.handleRolesChange = this.handleRolesChange.bind(this)
    this.handleRolesKeyUp = this.handleRolesKeyUp.bind(this)
    this.switchToSubmitForm = this.switchToSubmitForm.bind(this)
  }

  componentDidMount() {
    axios('https://youtaite-network-api.herokuapp.com/people')
      .then(response => {
        this.setState({
          personOptions: response.data.push({name: 'Add new person'}),
          roleOptions: [
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
      description: this.convertToMultiline(desc),
    })
    // display title, desc
    // insert new form inputs
  }

  convertToMultiline(text) {
    let multiline = []
    text.split("\n").forEach(line => {
      multiline.push(line)
      multiline.push(<br/>)
    })
    return multiline
  }

  handleRolesChange(e) {
    console.log(e)
  }

  handleRolesKeyUp(e) {
    console.log(e)
  }

  render() {
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
              class="float-left mr-3 responsive-iframe-container" 
              style={{width: '40%', 'padding-top': (40*9/16) + '%'}}>
              <iframe 
                className="responsive-iframe"
                width="560" height="315" 
                src="https://www.youtube.com/embed/ORVH8rl6WFo" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
            </div>
            <Linkify className="d-inline" style={{'white-space': 'pre-wrap'}}>
              {this.state.description}
            </Linkify>
          </Form.Group>
          <Card className="fixed-bottom container bg-light p-3 mb-2" border="secondary">
            <Form.Group className="" controlId="form-roles">
              <Form.Label>Enter name, tab or enter, enter role, rinse & repeat!</Form.Label>
              <Form.Control
                type="roles"
                value={this.state.roles}
                onChange={this.handleRolesChange}
                onKeyUp={this.handleRolesKeyUp}/>
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

export default Submit