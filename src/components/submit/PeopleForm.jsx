import React from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import PersonAutosuggest from './PersonAutosuggest'
import RoleAutosuggest from './RoleAutosuggest'
import AddNewPersonDialog from './addnewperson/AddNewPersonDialog'

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
    }

    // refs
    this.personInput = React.createRef()
    this.roleInput = this.props.roleInput
    // event handlers
    this.onPersonSuggestionSelected = this.onPersonSuggestionSelected.bind(this)
    this.handlePersonKeyDown = this.handlePersonKeyDown.bind(this)
    this.onRoleSuggestionSelected = this.onRoleSuggestionSelected.bind(this)
    this.handleRoleKeyDown = this.handleRoleKeyDown.bind(this)
    this.hideAddNewPersonDialog = this.hideAddNewPersonDialog.bind(this)
    this.addNewPerson = this.addNewPerson.bind(this)
  }

  componentDidMount() {
    axios('https://youtaite-network-api.herokuapp.com/people')
      .then(response => {
        this.setState({
          people: response.data.sort((a, b) => a.name.length - b.name.length) // shorter comes first,
        })
      })
      .catch(error => console.log(error))
    this.personInput.current.focus()
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.personInput.current.focus()
    }
  }

  // Autosuggest: what to do when person suggestion is selected
  onPersonSuggestionSelected(e, { suggestion }) {
    if (!e.metaKey) { // user meant to switch inputs, not enter suggestion
      if (suggestion.misc_id === 'add new') {
        this.setState({
          showAddNewPersonDialog: true,
        })
      } else {
        this.props.addPersonToSelected(suggestion)
        // move person to top
        this.setState(prevState => {
          const index = prevState.people.findIndex(person => person.misc_id === suggestion.misc_id)
          return {
            people: [prevState.people[index]]
              .concat(prevState.people.slice(0, index))
              .concat(prevState.people.slice(index + 1))
          }
        })
      }
    }
  }

  onRoleSuggestionSelected(e, { suggestion }) {
    if (!e.metaKey) { // user meant to switch inputs, not enter suggestion
      this.props.onRoleSuggestionSelected(suggestion)
    }
  }

  // event handler: switch to personInput when cmd/ctrl-enter is pressed in roleInput
  handleRoleKeyDown(e) {
    if (e.key === 'Enter' && e.metaKey === true) {
      this.personInput.current.focus()
    }
  }

  handlePersonKeyDown(e) {
    if (e.key === 'Enter' && e.metaKey === true) {
      this.roleInput.current.focus()
    }
  }

  hideAddNewPersonDialog() {
    this.setState({
      showAddNewPersonDialog: false,
    })
  }

  addNewPerson(newPerson) {
    this.setState(prevState => {
      let newPeople = prevState.people
      if (!prevState.people.find(person => person.misc_id === newPerson.misc_id)) {
        newPeople = [newPerson].concat(newPeople)
      }
      return {
        people: newPeople,
        showAddNewPersonDialog: false,
      }
    })
    this.props.addPersonToSelected(newPerson)
  }

  render() {
    let takenRoles = []
    let readOnly = true
    if (this.props.currentPerson) {
      takenRoles = this.props.currentPerson.roles || []
      readOnly = false
    }

    return (
      <>
        <Card className="sticky-top mb-3" bg="light">
          <Card.Header>{'Cmd/ctrl-enter to switch between the two inputs. Type "." to quickly bring up "Add new person" option.'}</Card.Header>
          <Card.Body>
            <Form.Row className='mb-2'>
              <Col>
                <PersonAutosuggest
                  people={this.state.people}
                  onSuggestionSelected={this.onPersonSuggestionSelected}
                  personInput={this.personInput}
                  handleKeyDown={this.handlePersonKeyDown} />
              </Col>
              <Col>
                <RoleAutosuggest
                  takenRoles={takenRoles}
                  readOnly={readOnly}
                  onSuggestionSelected={this.onRoleSuggestionSelected}
                  roleInput={this.roleInput}
                  handleKeyDown={this.handleRoleKeyDown} />
              </Col>
            </Form.Row>
            <Button className="w-100" variant="primary" type="button" onClick={this.props.handleSubmit}>
              Submit all
            </Button>
          </Card.Body>
        </Card>
        <AddNewPersonDialog
          show={this.state.showAddNewPersonDialog}
          handleClose={this.hideAddNewPersonDialog}
          handleAddNewPerson={this.addNewPerson} />
      </>
    );
  }
}

export default PeopleForm
