import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PersonAutosuggest from './PersonAutosuggest';
import RoleAutosuggest from './RoleAutosuggest';
import AddNewPersonDialog from './addnewperson/AddNewPersonDialog';

class PeopleForm extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // handleSubmit
    // onRoleSuggestionSelected
    // addPersonToSelected
    // currentPerson
    this.state = {
      people: [],
      showAddNewPersonDialog: false,
    };

    // refs
    this.personInput = React.createRef();
    // event handlers
    this.handlePersonSuggestionSelected = this.handlePersonSuggestionSelected.bind(this);
    this.handlePersonKeyDown = this.handlePersonKeyDown.bind(this);
    this.handleRoleSuggestionSelected = this.handleRoleSuggestionSelected.bind(this);
    this.handleRoleKeyDown = this.handleRoleKeyDown.bind(this);
    this.hideAddNewPersonDialog = this.hideAddNewPersonDialog.bind(this);
    this.addNewPerson = this.addNewPerson.bind(this);
  }

  componentDidMount() {
    axios(`${process.env.REACT_APP_API_URL}/people`)
      .then((response) => {
        this.setState({
          people: response.data.sort((a, b) => a.name.length - b.name.length),
        });
      })
      .catch((error) => console.error(error));
    this.personInput.current.focus();
  }

  componentDidUpdate(prevProps) {
    const { people } = this.state;
    const { show, currentPerson } = this.props;
    if (!prevProps.show && show) {
      this.personInput.current.focus();
    }
    this.addCurrentPersonToPeople(currentPerson, people);
  }

  // Autosuggest: what to do when person suggestion is selected
  handlePersonSuggestionSelected(e, { suggestion }) {
    if (!e.metaKey) { // user meant to switch inputs, not enter suggestion
      if (suggestion.misc_id === 'add new') {
        this.setState({
          showAddNewPersonDialog: true,
        });
      } else {
        const { addPersonToSelected } = this.props;
        addPersonToSelected(suggestion);
        // move person to top
        this.setState((prevState) => {
          const index = prevState.people
            .findIndex((person) => person.misc_id === suggestion.misc_id);
          return {
            people: [prevState.people[index]]
              .concat(prevState.people.slice(0, index))
              .concat(prevState.people.slice(index + 1)),
          };
        });
      }
    }
  }

  handleRoleSuggestionSelected(e, { suggestion }) {
    if (!e.metaKey) { // user meant to switch inputs, not enter suggestion
      const { onRoleSuggestionSelected } = this.props;
      onRoleSuggestionSelected(suggestion);
    }
  }

  // event handler: switch to personInput when cmd/ctrl-enter is pressed in roleInput
  handleRoleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      this.personInput.current.focus();
    }
  }

  handlePersonKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      const { roleInput } = this.props;
      roleInput.current.focus();
    }
  }

  addCurrentPersonToPeople(currentPerson, people) {
    if (currentPerson
      && !people.find((person) => person.misc_id === currentPerson.misc_id)
    ) {
      this.setState((prevState) => ({
        people: [currentPerson].concat(prevState.people),
      }));
    }
  }

  hideAddNewPersonDialog() {
    this.setState({
      showAddNewPersonDialog: false,
    });
  }

  addNewPerson(newPerson) {
    const { addPersonToSelected } = this.props;
    this.setState((prevState) => {
      let newPeople = prevState.people;
      if (!prevState.people.find((person) => person.misc_id === newPerson.misc_id)) {
        newPeople = [newPerson].concat(newPeople);
      }
      return {
        people: newPeople,
        showAddNewPersonDialog: false,
      };
    });
    addPersonToSelected(newPerson);
  }

  render() {
    const { people, showAddNewPersonDialog } = this.state;
    const { currentPerson, handleSubmit, roleInput } = this.props;
    let takenRoles = [];
    let readOnly = true;
    if (currentPerson) {
      takenRoles = currentPerson.roles || [];
      readOnly = false;
    }

    return (
      <>
        <Card className="sticky-top mb-3" bg="light">
          <Card.Header>
            Cmd/ctrl-enter to switch between the two inputs.
            {' '}
            Type &apos;.&apos; to quickly bring up &apos;Add new person&apos; option.
          </Card.Header>
          <Card.Body>
            <Form.Row className="mb-2">
              <Col>
                <PersonAutosuggest
                  people={people}
                  onSuggestionSelected={this.handlePersonSuggestionSelected}
                  personInput={this.personInput}
                  onKeyDown={this.handlePersonKeyDown}
                />
              </Col>
              <Col>
                <RoleAutosuggest
                  takenRoles={takenRoles}
                  readOnly={readOnly}
                  onSuggestionSelected={this.handleRoleSuggestionSelected}
                  roleInput={roleInput}
                  onKeyDown={this.handleRoleKeyDown}
                />
              </Col>
            </Form.Row>
            <Button className="w-100" variant="primary" type="button" onClick={handleSubmit}>
              Submit all
            </Button>
          </Card.Body>
        </Card>
        <AddNewPersonDialog
          show={showAddNewPersonDialog}
          handleClose={this.hideAddNewPersonDialog}
          handleAddNewPerson={this.addNewPerson}
        />
      </>
    );
  }
}

PeopleForm.propTypes = {
  show: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onRoleSuggestionSelected: PropTypes.func.isRequired,
  roleInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  addPersonToSelected: PropTypes.func.isRequired,
  currentPerson: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    misc_id: PropTypes.string.isRequired,
    id_type: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default PeopleForm;
