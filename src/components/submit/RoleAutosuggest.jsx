import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

// Autosuggest: rendering role suggestions
const renderSuggestion = (suggestion) => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div className="ml-1 text-truncate">
      <strong>
        {suggestion}
      </strong>
    </div>
  </div>
);

// Autosuggest: how to convert a suggestion to text
const getSuggestionValue = (suggestion) => suggestion;

class RoleAutosuggest extends React.Component {
  constructor(props) {
    super(props);
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
        'vocal',
      ],
    };

    // event handlers
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this);
  }

  handleChange(e, { newValue }) {
    this.setState({
      inputValue: newValue,
    });
  }

  // Autosuggest: update role suggestions
  handleSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  }

  // Autosuggest: clear role suggestions
  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  handleSuggestionSelected(e, args) {
    const { onSuggestionSelected } = this.props;
    onSuggestionSelected(e, args);
    this.setState({
      inputValue: '',
    });
  }

  // Auosuggest: calculate role suggestions based on input
  getSuggestions(value) {
    const { takenRoles } = this.props;
    const { roles } = this.state;
    const inputValue = value.replace(/[ \t\n]/g, '').toLowerCase();
    const suggestions = inputValue.length === 0 ? []
      : roles.filter((role) => !takenRoles.includes(role)
        && role.toLowerCase().includes(inputValue));
    if (!takenRoles.includes('misc')) {
      suggestions.push('misc');
    }
    return suggestions;
  }

  render() {
    const { inputValue, suggestions } = this.state;
    const { onKeyDown, roleInput, readOnly } = this.props;

    // Autosuggest: input props for roleInput
    const inputProps = {
      placeholder: 'organize',
      value: inputValue,
      onChange: this.handleChange,
      onKeyDown,
      className: 'form-control',
      ref: roleInput,
      readOnly,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.handleSuggestionSelected}
        highlightFirstSuggestion
      />
    );
  }
}

RoleAutosuggest.propTypes = {
  takenRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  roleInput: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default RoleAutosuggest;
