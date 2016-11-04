import React, { Component, PropTypes } from 'react';
// import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import * as tagsActions from 'redux/modules/tags';
import { asyncConnect } from 'redux-async-connect';
import includes from 'lodash/includes';
// import get from 'lodash/get';
import flatten from 'lodash/flatten';
// import uniq from 'lodash/uniq';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import xor from 'lodash/xor';
import { AlwaysVisible,
  CTA,
  SuggestResource,
  ReactTags,
  Pagination,
  Tag } from 'components';

@asyncConnect([{
  promise: ({ store: { dispatch, getState }}) => {
    const { isLoaded: areTagsLoaded,
      load: loadTags } = tagsActions;

    const promises = [];

    if (!areTagsLoaded(getState())) {
      promises.push(dispatch(loadTags()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    allTags: state.tags.data,
    inputTags: state.tags.inputTags,
    inputTagsInfo: state.tags.inputTagsInfo,
    resources: state.tags.resources
  }),
  tagsActions
)
export default class FrontendAdvisor extends Component {
  static propTypes = {
    allTags: PropTypes.array,
    inputTags: PropTypes.array,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    inputTagsInfo: PropTypes.object,
    changeTags: PropTypes.func,
    loadTag: PropTypes.func,
    resources: PropTypes.array
  };

  handleAddition = (tag) => {
    const { isTagLoaded } = tagsActions;
    const {
      addTag,
      allTags,
      inputTagsInfo,
      loadTag
    } = this.props;
    if (includes(allTags, tag)) {
      addTag(tag);
      if (!isTagLoaded(inputTagsInfo, tag)) {
        loadTag(tag);
      }
    }
  };

  handleChange = (tags) => {
    console.log('Handle change: ', tags);
    const { isTagLoaded } = tagsActions;
    const {
      inputTagsInfo,
      loadTag
    } = this.props;

    this.props.changeTags(tags);
    tags.forEach((tag) => {
      if (!isTagLoaded(inputTagsInfo, tag)) {
        loadTag(tag);
      }
    });
  };

  render() {
    const styles = require('./FrontendAdvisor.scss');
    const {
      allTags,
      inputTags,
      // removeTag,
      // inputTagsInfo,
      resources
    } = this.props;

    const possibleTags = inputTags.length ? xor(flatten(resources.map((resource) => resource.tags)), inputTags) : allTags;

    const items = (resources && !!resources.length) ? resources.map(({ title, tags, url, description }, i) => <Panel key={i}>
        <h3>{title}</h3>
        <p>{description}</p>
        <p><a href={url} target={'_blank'}>
          <i className={`fa fa-globe`}></i> {url}
        </a></p>
        <p>Tags: {tags.map((tag, _i) =>
          <Tag
            key={_i}
            onClick={() => this.handleAddition(tag)} >
            {tag}
          </Tag>)}</p>
      </Panel>) : [];

    return (
      <div className={`container ${styles.frontendAdvisor}`}>
        <div className={`${styles.masthead}`}>
          <h1 className={`text-center`}>
            FrontendAdvisor <br/>
            <small>is here to help!</small>
          </h1>

          <h2 className={`text-center`}>
            Enter what you want to learn today:
          </h2>

          {/* <AlwaysVisible style={{ height: 82, position: 'relative', zIndex: 1 }}> */}
          <ReactTags
            classNames={{
              // tag: styles.tag,
              // remove: styles.remove,
              // suggestions: styles.suggestions,
              tagInputField: `${styles.tagInputField}`
            }}
            tags={inputTags}
            suggestions={possibleTags}
            handleChange={this.handleChange}
            // handleDelete={(i) => (i !== -1) && removeTag(inputTags[i].text)}
            // handleAddition={this.handleAddition}
            autocomplete={!false}
          />
          {/* </AlwaysVisible> */}

          <Row>
            <Col xs={12} className="m-t-20 m-b-20">
              <button className={`btn btn-default`}>Suprise me!</button>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              { possibleTags.map((tag, i) => (
                <a
                  key={i}
                  onClick={() => this.handleAddition(tag)}>
                  {tag}, </a>)) }
            </Col>
          </Row>
        </div>

        <div>
          <Pagination
            items={items}
            itemsPerPage={10} />
        </div>

        <CTA />

        <SuggestResource />
      </div>
    );
  }
}
