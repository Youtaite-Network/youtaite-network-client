import React from 'react'
import Autosuggest from 'react-autosuggest'

// Autosuggest: rendering role suggestions
const renderSuggestion = suggestion => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div className="ml-1 text-truncate"><strong>
      {suggestion}
    </strong></div>
  </div>
)

class RoleAutosuggest extends React.Component {
  constructor(props) {
    super(props)
    // PROPS
    // takenRoles
    // onSuggestionSelected
    // handleKeyDown
    // roleInput
    // readOnly
    this.state = {
      inputValue: '',
      suggestions: [],
      roles: [
        'art',
        'guide',
        'lyrics',
        'mix',
        'organize',
        'script',
        'translate',
        'video',
        'vocal',
        'misc',
      ],
    }

    // event handlers
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.handleChange = this.handleChange.bind(this) 
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
  }

  handleChange(e, {newValue}) {
    this.setState({
      inputValue: newValue,
    })
  }

  // Auosuggest: calculate role suggestions based on input
  getRoleSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    const availableRoles = this.state.roles.filter(role => !this.props.takenRoles.includes(role))
    const suggestions = inputLength === 0 ? [] : availableRoles.filter(role =>
      role.toLowerCase().slice(0, inputLength) === inputValue
    )
    if (suggestions.length < 6 && !suggestions.includes('misc') && !this.props.takenRoles.includes('misc')) {
      suggestions.push('misc')
    }
    return suggestions.splice(0, 6)
  }

  // Autosuggest: update role suggestions
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getRoleSuggestions(value),
    });
  };

  // Autosuggest: clear role suggestions
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  };

  // Autosuggest: how to convert a suggestion to text
  getSuggestionValue(suggestion){
    return suggestion
  }

  onSuggestionSelected(e, args) {
    this.props.onSuggestionSelected(e, args)
    this.setState({
      inputValue: '',
    })
  }

  render() {
    const { inputValue, suggestions } = this.state;

    // Autosuggest: input props for roleInput
    const inputProps = {
      placeholder: 'organize',
      value: inputValue,
      onChange: this.handleChange,
      onKeyDown: this.props.handleKeyDown,
      className: 'form-control',
      ref: this.props.roleInput,
      readOnly: this.props.readOnly,
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSuggestionSelected}
        highlightFirstSuggestion={true}
      />
    );
  }
}

export default RoleAutosuggest
