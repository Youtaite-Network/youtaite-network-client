import React, { useState } from 'react';
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

function CollabAutosuggest({ allCollabs, currentCollabs, onSuggestionSelected }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSuggestionsFetchRequested = ({ value }) => {

  };

  const handleSuggestionsClearRequested = () => {

  };

  const handleSuggestionSelected = () => {

  };

  const getSuggestionValue = () => {

  };

  const handleChange = (e, { newValue }) => {
    setInputValue(newValue);
  };

  const inputProps = {
    placeholder: 'Snow Halation',
    value: inputValue,
    onChange: handleChange,
    className: 'form-control',
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

export default CollabAutosuggest;
