import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import Autosuggest from 'react-autosuggest';

// Autosuggest: rendering person suggestions
const renderSuggestion = (suggestion) => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div>
      <Image className="mr-1" width="40px" height="40px" roundedCircle src={suggestion.thumbnail} />
    </div>
    <div className="ml-1 text-truncate">
      <strong>
        {suggestion.name}
      </strong>
    </div>
  </div>
);

// convert a suggestion to text
const getSuggestionValue = (suggestion) => suggestion.name;

class PersonAutosuggest extends React.Component {
  constructor(props) {
    super(props);
    // PROPS
    // people
    // onSuggestionSelected
    // personInput
    // onKeyDown
    this.state = {
      inputValue: '',
      suggestions: [],
    };

    // event handlers
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleChange(e, { newValue }) {
    this.setState({
      inputValue: newValue,
    });
  }

  handleFocus() {
    this.setState({
      inputValue: '',
    });
  }

  // update suggestions
  onSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  // clear suggestions
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  // calculate person suggestions for any given input value
  getSuggestions(value) {
    const inputValue = value.replace(/[ \t\n.]/g, '').toLowerCase();
    const { people } = this.props;
    let suggestions = inputValue.length === 0 ? [] : people.filter((person) => person.name.replace(/[ \t\n.]/g, '').toLowerCase().includes(inputValue));
    suggestions = suggestions.slice(0, 10);
    suggestions.push({ name: 'Add new person', misc_id: 'add new' });
    return suggestions;
  }

  render() {
    const { inputValue, suggestions } = this.state;
    const { onKeyDown, personInput, onSuggestionSelected } = this.props;

    // Autosuggest: input props for personInput
    const inputProps = {
      placeholder: 'Alias',
      value: inputValue,
      onChange: this.handleChange,
      onKeyDown,
      onFocus: this.handleFocus,
      className: 'form-control',
      ref: personInput,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        focusInputOnSuggestionClick={false}
        highlightFirstSuggestion
      />
    );
  }
}

PersonAutosuggest.propTypes = {
  people: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  personInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

export default PersonAutosuggest;
