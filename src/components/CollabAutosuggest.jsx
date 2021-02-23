import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';
import Autosuggest from 'react-autosuggest';

// Autosuggest: rendering person suggestions
const renderSuggestion = (suggestion) => (
  <div className="row flex-row align-items-center flex-nowrap p-1 m-0">
    <div>
      <Image className="mr-1" width="71px" height="40px" rounded src={suggestion.thumbnail} />
    </div>
    <div className="ml-1 text-truncate d-flex flex-column">
      {suggestion.title}
      {suggestion.subtitle && (
        <small style={{ color: 'grey' }}>{suggestion.subtitle}</small>
      )}
    </div>
  </div>
);

const getSuggestionValue = (suggestion) => suggestion.title;

function CollabAutosuggest({ allCollabs, currentCollabs }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSuggestionsFetchRequested = ({ value }) => {
    const suggestValue = value.replace(/[ \t\n.]/g, '').toLowerCase();
    let newSuggestions = suggestValue.length === 0 ? [] : allCollabs.filter((collab) => collab.title.replace(/[ \t\n.]/g, '').toLowerCase().includes(suggestValue));
    newSuggestions = newSuggestions.slice(0, 20).map((s) => {
      const current = currentCollabs.find((collab) => collab.id === s.id);
      if (!current) {
        return { ...s, subtitle: 'not found in current view' };
      }
      return s;
    });
    setSuggestions(newSuggestions);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSuggestionSelected = (...args) => {
    console.log(currentCollabs);
    console.log('handleSuggestionSelected', args);
  };

  const handleChange = (e, { newValue }) => {
    setInputValue(newValue);
  };

  const inputProps = {
    placeholder: 'Search for a collab (eg, \'Snow Halation\')',
    value: inputValue,
    onChange: handleChange,
    className: 'form-control mb-1',
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      onSuggestionSelected={handleSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      focusInputOnSuggestionClick={false}
      highlightFirstSuggestion
    />
  );
}

CollabAutosuggest.propTypes = {
  allCollabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
  currentCollabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
};

export default CollabAutosuggest;
