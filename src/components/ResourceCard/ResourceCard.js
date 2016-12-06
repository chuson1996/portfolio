import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import c from 'classnames';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import * as tagsActions from 'redux/modules/tags';

@connect(
  (state) => ({
    allTags: state.tags.data,
    inputTags: state.tags.inputTags,
  }),
  {
    ...tagsActions,
  }
)
export default class ResourceCard extends Component {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    url: PropTypes.string.isRequired,
    creator: PropTypes.string,
    allTags: PropTypes.array,
    inputTags: PropTypes.array,
    addTag: PropTypes.func.isRequired,
    loadTag: PropTypes.func.isRequired,
  };

  handleAddition = (tag) => {
    // const { isTagLoaded } = tagsActions;
    const {
      addTag,
      allTags,
      inputTags,
      // inputTagsInfo,
      loadTag
    } = this.props;
    if (includes(allTags, tag) && !includes(inputTags, tag)) {
      addTag(tag);
      /* Load even when it's not available */
      loadTag(tag);

      /* Only load when it's not available */
      // if (!isTagLoaded(inputTagsInfo, tag)) {
      //   loadTag(tag);
      // }
    }
  };

  render() {
    const { title, description, tags, url, creator, ...others } = this.props;
    const styles = require('./ResourceCard.scss');

    const isInBookmark = !!creator;

    return (
      <Panel {...others}>
        <h3 className="m-b-12">{title}</h3>
        {isInBookmark &&
          <p className={c(styles.bookmarkedText)}>
            <i className="material-icons m-r-10">lock_outline</i>
            Bookmarked
          </p>
        }
        <p className="m-b-12">{description}</p>
        <p className="m-b-12">
          <a href={url} target={'_blank'}>
            <i className={`fa fa-globe`}></i>&nbsp;{url}
          </a>
        </p>
        <p className="m-b-12">
          <span className={`gray`}>Tags: </span>
          {tags && tags.map((tag, _i) =>
            <span key={_i}>
              { _i !== 0 && <span>, </span>}
              <a
                className="link link-dark"
                onClick={() => this.handleAddition(tag)}>{tag}</a>
            </span>
          )}
        </p>
      </Panel>
    );
  }
}
