import update from 'react-addons-update';
// import { WithContext as ReactTags } from 'react-tag-input';
import { ReactTags } from 'components';
import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react';

@connect(
  (state) => ({
    allTags: state.tags.data,
  })
)
export default class TagInput extends Component {
  static propTypes = {
    input: PropTypes.object,
    allTags: PropTypes.array
  };

  handleAddition = (tag) => {
    const {input: { value, onChange }} = this.props;
    onChange([...value, tag]);
  };

  handleDelete = (i) => {
    const {input: { value, onChange }} = this.props;
    if (i !== -1) {
      // removeTag(inputTags[i].text);
      onChange(update(value, {
        $splice: [[i, 1]]
      }));
    }
  };

  handleChange = (tags) => {
    const {input: { onChange }} = this.props;
    onChange(tags);
  };

  transformTags(text, id) {
    return {text, id};
  }

  render() {
    const {
      input: { value },
      allTags
    } = this.props;
    return (
      <ReactTags
        tags={value}
        suggestions={allTags}
        handleChange={this.handleChange}
      />
    );
  }
}
