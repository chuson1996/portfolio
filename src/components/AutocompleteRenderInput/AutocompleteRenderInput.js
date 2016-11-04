import React, { Component, PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import get from 'lodash/get';

export default class AutocompleteRenderInput extends Component {
  static propTypes = {
    addTag: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    suggestions: PropTypes.array,
    ref: PropTypes.any,
    autocomplete: PropTypes.bool,
    classNames: PropTypes.object
  };

  render() {
    const {addTag, autocomplete, classNames, ...other} = this.props;
    // const styles = require('./AutocompleteRenderInput.scss');
    const theme = {
      // container: ,
      // containerOpen: styles['container--open'],
      // input: styles['input'],
      suggestionsContainer: get(classNames, 'suggestions'),
      // suggestionsList: styles['suggestions-list'],
      // suggestion: styles['suggestion'],
      suggestionFocused: 'active',
      // sectionContainer: styles['section-container'],
      // sectionTitle: styles['section-title']
    };

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

    const clearSuggestions = () => suggestions = [];

    return (
      <Autosuggest
        theme={theme}
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
        onSuggestionsClearRequested={clearSuggestions}
        focusFirstSuggestion={this.props.autocomplete}
        renderInputComponent={({ className, ...props }) => <div className="input-group">
          <input type="text" className="form-control" {...props}/>
          <span className="input-group-btn">
            <button className="btn" onClick={clearSuggestions}>
              <i className="fa fa-close"></i>
            </button>
          </span>
        </div>}
      />
    );
  }
}
