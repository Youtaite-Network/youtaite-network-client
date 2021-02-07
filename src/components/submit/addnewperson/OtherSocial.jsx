import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class UseOtherSocial extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // show
    // handleSubmit
    this.state = {
      alias: '',
      socialLink: '',
    };

    // refs
    this.twRadio = React.createRef()
    this.igRadio = React.createRef()
    this.otherRadio = React.createRef()
    this.input = React.createRef()
    // event handlers
    this.handleAliasChange = this.handleAliasChange.bind(this)
    this.handleSocialLinkChange = this.handleSocialLinkChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.input.current.focus()
    }
  }

  handleAliasChange(e) {
    this.setState({
      alias: e.target.value,
    })
  }

  handleSocialLinkChange(e) {
    this.setState({
      socialLink: e.target.value,
    })
  }

  handleAdd(e) {
    let person = {}
    person.thumbnail = '#'
    person.name = this.state.alias

    if (this.state.alias === '') {
      person.misc_id = this.state.alias
      person.id_type = 'no_link'
    } else {
      person.misc_id = this.state.socialLink
      if (this.twRadio.current.checked) {
        person.id_type = 'tw'
      } else if (this.igRadio.current.checked) {
        person.id_type = 'ig'
      } else {
        person.id_type = 'other'
      }
    }

    this.props.handleSubmit(person)
  }

  render() {
    return (
      <div className={this.props.show ? '' : 'd-none'}>
        <hr/>
        <Form.Group>
          <Form.Label>Enter alias</Form.Label>
          <Form.Control
            type="alias"
            placeholder="Alias"
            value={this.state.alias}
            onChange={this.handleAliasChange}
            ref={this.input} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Enter another social link (blank if none)</Form.Label>
          <Form.Control
            type="social_link"
            placeholder="https://twitter.com/XXXXX"
            value={this.state.socialLink}
            onChange={this.handleSocialLinkChange} />
        </Form.Group>
        <Form.Group>
          <Form.Check 
            id="tw-radio"
            type="radio"
            label="twitter"
            name="social-type"
            ref={this.twRadio}
          />
          <Form.Check 
            id="ig-radio"
            type="radio"
            label="instagram"
            name="social-type"
            ref={this.igRadio}
          />
          <Form.Check 
            id="other-radio"
            type="radio"
            label="other/no link"
            name="social-type"
            ref={this.otherRadio}
          />
        </Form.Group>
        <Button className="ml-1" variant="primary" disabled={this.state.alias.length === 0} onClick={this.handleAdd}>
          Add
        </Button>
      </div>
    );
  }
}

export default UseOtherSocial
