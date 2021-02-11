import React from 'react'
import Image from 'react-bootstrap/Image'
import Autosuggest from 'react-autosuggest'

// Autosuggest: rendering person suggestions
const renderSuggestion = suggestion => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div>
      <Image className="mr-1" width="40px" height="40px" roundedCircle src={suggestion.thumbnail} />
    </div>
    <div className="ml-1 text-truncate"><strong>
      {suggestion.name}
    </strong></div>
  </div>
)

class PersonAutosuggest extends React.Component {
  constructor(props) {
    super(props)
    // PROPS
    // people
    // onSuggestionSelected
    // personInput
    // handleKeyDown
    this.state = {
      inputValue: '',
      suggestions: [],
    }

    // event handlers
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.handleChange = this.handleChange.bind(this) 
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleChange(e, {newValue}) {
    this.setState({
      inputValue: newValue,
    })
  }

  handleFocus(e) {
    this.setState({
      inputValue: '',
    })
  }

  // calculate person suggestions for any given input value
  getSuggestions(value) {
    const inputValue = value.replace(/[ \t\n]/g, '').toLowerCase()
    let suggestions = inputValue.length === 0 ? [] : this.props.people.filter(person => {
      return person.name.replace(/[ \t\n]/g, '').toLowerCase().includes(inputValue)
    })
    suggestions.push({name: 'Add new person', misc_id: 'add new'})
    return suggestions
  }

  // update suggestions
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // clear suggestions
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  // convert a suggestion to text
  getSuggestionValue(suggestion){
    return suggestion.name
  }

  render() {
    const { inputValue, suggestions } = this.state;

    // Autosuggest: input props for personInput
    const inputProps = {
      placeholder: 'Alias',
      value: inputValue,
      onChange: this.handleChange,
      onKeyDown: this.props.handleKeyDown,
      onFocus: this.handleFocus,
      className: 'form-control',
      ref: this.props.personInput,
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.props.onSuggestionSelected}
        focusInputOnSuggestionClick={false}
        highlightFirstSuggestion={true}
      />
    )
  }
}

export default PersonAutosuggest


