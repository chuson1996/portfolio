import React, { Component, PropTypes } from 'react';
import TagsInput from 'react-tagsinput';
// import get from 'lodash/get';
import intersection from 'lodash/intersection';
import {AutocompleteRenderInput} from 'components';
import { Tag } from 'components';

export default class ReactTags extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    handleChange: PropTypes.func,
    tags: PropTypes.array,
    autocomplete: PropTypes.bool,
    classNames: PropTypes.object
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
    const { suggestions, autocomplete, classNames } = this.props;
    const styles = require('./ReactTags.scss');
    classNames.suggestions = styles.suggestions;

    return (
      <TagsInput
        ref={(elem) => this.tagsInputRef = elem}
        className={styles.tagsInput}
        focusedClassName={styles.focused}
        renderTag={(props) => <Tag index={props.key} {...props} />}
        renderInput={(props) => <AutocompleteRenderInput
          {...{autocomplete, suggestions, classNames}}
          {...props} />
        }
        value={this.props.tags}
        onChange={::this.handleChange} />
    );
  }
}
