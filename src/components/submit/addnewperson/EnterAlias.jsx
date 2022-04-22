import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
    this.defaultButton = React.createRef();
    this.input = React.createRef();
    // event handlers
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (!prevProps.show && show) {
      this.input.current.focus();
    }
  }

  handleAliasChange(e) {
    this.setState({
      alias: e.target.value,
    });
  }

  handleAdd() {
    const { alias } = this.state;
    const { channelLink, handleSubmit } = this.props;
    const person = {
      name: alias,
      misc_id: channelLink,
      id_type: 'yt_link',
      thumbnail: '#',
    };
    handleSubmit(person);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.defaultButton.current.click();
    }
  }

  render() {
    const { show } = this.props;
    const { alias } = this.state;
    return show && (
      <>
        <hr />
        <Form.Group>
          <Form.Label>Enter alias</Form.Label>
          <Form.Control
            type="alias"
            placeholder="Alias"
            value={alias}
            onChange={this.handleAliasChange}
            onKeyDown={this.handleKeyDown}
            ref={this.input}
          />
        </Form.Group>
        <Button ref={this.defaultButton} className="ml-1" variant="primary" disabled={alias.length === 0} onClick={this.handleAdd}>
          Add
        </Button>
      </>
    );
  }
}

EnterAlias.propTypes = {
  show: PropTypes.bool.isRequired,
  channelLink: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default EnterAlias;
