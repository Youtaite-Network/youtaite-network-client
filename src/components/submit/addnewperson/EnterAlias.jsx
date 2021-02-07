import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class EnterAlias extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // show
    // channelLink
    // handleSubmit
    this.state = {
      alias: '',
    };

    // refs
    this.defaultButton = React.createRef()
    this.input = React.createRef()
    // event handlers
    this.handleAliasChange = this.handleAliasChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
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

  handleAdd(e) {
    let person = {
      name: this.state.alias,
      misc_id: this.props.channelLink,
      id_type: 'yt_link',
      thumbnail: '#',
    }
    this.props.handleSubmit(person)
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click()
    }
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
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </Form.Group>
        <Button ref={this.defaultButton} className="ml-1" variant="primary" disabled={this.state.alias.length === 0} onClick={this.handleAdd}>
          Add
        </Button>
      </div>
    );
  }
}

export default EnterAlias
