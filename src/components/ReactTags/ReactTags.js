import React, { Component, PropTypes } from 'react';
import TagsInput from 'react-tagsinput';
// import last from 'lodash/last';
import intersection from 'lodash/intersection';
import {AutocompleteRenderInput} from 'components';

export default class ReactTags extends Component {
  static propTypes = {
    addTag: PropTypes.func,
    suggestions: PropTypes.array,
    handleChange: PropTypes.func,
    tags: PropTypes.array,
    autocomplete: PropTypes.bool
  };

  handleChange(newTags) {
    const { handleChange, suggestions, tags: oldTags, autocomplete } = this.props;
    if (autocomplete) {
      handleChange(intersection(newTags, [...suggestions, ...oldTags]));
    } else {
      handleChange(newTags);
    }
  }

  render() {
    const { suggestions, autocomplete } = this.props;

    return (<TagsInput
      renderInput={(props) => <AutocompleteRenderInput
        {...{...props, autocomplete, suggestions}
      }/>}
      value={this.props.tags}
      onChange={::this.handleChange} />);
  }
}
