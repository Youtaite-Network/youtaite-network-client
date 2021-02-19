import React from 'react'
import Autosuggest from 'react-autosuggest'

// Autosuggest: rendering role suggestions
const renderSuggestion = suggestion => (
  <div className='row flex-row align-items-center flex-nowrap p-1 m-0'>
    <div className='ml-1 text-truncate'><strong>
      {suggestion}
    </strong>
    </div>
  </div>
)

class RoleAutosuggest extends React.Component {
  constructor (props) {
    super(props)
    // PROPS
    // takenRoles
    // onSuggestionSelected
    // onKeyDown
    // roleInput
    // readOnly
    this.state = {
      inputValue: '',
      suggestions: [],
      roles: [
        'arrange',
        'art',
        'compose',
        'guide',
        'instrumental',
        'lyrics',
        'mix',
        'organize',
        'script',
        'translate',
        'video',
        'vocal'
      ]
    }

    // event handlers
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this)
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this)
  }

  handleChange (e, { newValue }) {
    this.setState({
      inputValue: newValue
    })
  }

  // Auosuggest: calculate role suggestions based on input
  getSuggestions (value) {
    const inputValue = value.replace(/[ \t\n]/g, '').toLowerCase()
    const suggestions = inputValue.length === 0 ? [] : this.state.roles.filter(role => {
      return !this.props.takenRoles.includes(role) && role.toLowerCase().includes(inputValue)
    })
    if (!this.props.takenRoles.includes('misc')) {
      suggestions.push('misc')
    }
    return suggestions
  }

  // Autosuggest: update role suggestions
  handleSuggestionsFetchRequested ({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  };

  // Autosuggest: clear role suggestions
  handleSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  };

  // Autosuggest: how to convert a suggestion to text
  getSuggestionValue (suggestion) {
    return suggestion
  }

  handleSuggestionSelected (e, args) {
    this.props.onSuggestionSelected(e, args)
    this.setState({
      inputValue: ''
    })
  }

  render () {
    const { inputValue, suggestions } = this.state

    // Autosuggest: input props for roleInput
    const inputProps = {
      placeholder: 'organize',
      value: inputValue,
      onChange: this.handleChange,
      onKeyDown: this.props.onKeyDown,
      className: 'form-control',
      ref: this.props.roleInput,
      readOnly: this.props.readOnly
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.handleSuggestionSelected}
        highlightFirstSuggestion
      />
    )
  }
}

export default RoleAutosuggest
