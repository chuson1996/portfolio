import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import c from 'classnames';
import includes from 'lodash/includes';
import { connect } from 'react-redux';
import * as tagsActions from 'redux/modules/tags';
import formatDate from 'date-fns/format';

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
    createdAt: PropTypes.string,
    allTags: PropTypes.array,
    inputTags: PropTypes.array,
    addTag: PropTypes.func.isRequired,
    loadTag: PropTypes.func.isRequired,
    saved: PropTypes.bool
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
    const { title, description, tags, url, creator, saved, createdAt, ...others } = this.props;
    const s = require('./ResourceCard.scss');

    const isInBookmark = !!creator;

    return (
      <Panel {...others}>
        <h3 className={c('m-b-12', s.title)}>
          {title}
        </h3>
        <i className={c('material-icons pull-right visible-xs m-t-22', s.bookmarkIcon, s.mobile)}>{ saved ? 'bookmark' : 'bookmark_border' }</i>
        {isInBookmark &&
          <p className={c(s.bookmarkedText)}>
            <i className="material-icons m-r-10">lock_outline</i>
            Private
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
        <div className={c('hidden-xs')}>
          <hr/>
          <Row>
            <Col md={7}>
              <p className={'gray-granite'}>
                <i className={c('material-icons', { 'm-r-10': saved }, s.bookmarkIcon)}>{ saved ? 'bookmark' : 'bookmark_border' }</i>
                { saved && <span>Saved</span> }
              </p>
            </Col>
            <Col md={5} className={'text-right gray-granite'}>
              { formatDate(createdAt, 'D MMM') }
            </Col>
          </Row>
        </div>
      </Panel>
    );
  }
}
