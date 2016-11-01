import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';

export default class AutocompleteRenderInput extends Component {
  static propTypes = {
    addTag: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    suggestions: PropTypes.array,
    ref: PropTypes.any,
    autocomplete: PropTypes.bool
  };

  render() {
    const {addTag, autocomplete, ...other} = this.props;

    const handleOnChange = (e, {method}) => {
      if (method === 'enter') {
        e.preventDefault();
      } else {
        this.props.onChange(e);
      }
    };

    const inputValue = (this.props.value && this.props.value.trim().toLowerCase()) || '';
    const inputLength = inputValue.length;


    let suggestions = this.props.suggestions.filter((state) => {
      return state.toLowerCase().slice(0, inputLength) === inputValue;
    });

    return (
      <Autosuggest
        ref={this.props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 0}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <span>{suggestion}</span>}
        inputProps={{...other, onChange: handleOnChange}}
        onSuggestionSelected={(e, {suggestion}) => {
          this.props.addTag(suggestion);
        }}
        onSuggestionsFetchRequested={() => {}}
        onSuggestionsClearRequested={() => suggestions = []}
        focusFirstSuggestion={this.props.autocomplete}
      />
    );
  }
}
