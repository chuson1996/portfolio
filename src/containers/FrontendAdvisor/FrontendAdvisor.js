import React, { Component, PropTypes } from 'react';
// import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import * as tagsActions from 'redux/modules/tags';
import { asyncConnect } from 'redux-async-connect';
import includes from 'lodash/includes';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import sampleSize from 'lodash/sampleSize';
// import uniq from 'lodash/uniq';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import xor from 'lodash/xor';
import {
  // AlwaysVisible,
  // CTA,
  // SuggestResource,
  ReactTags,
  Pagination,
  // Tag,
} from 'components';

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

  componentDidMount() {
    const cb = () => {
      const {
        allTags,
        inputTags,
        // removeTag,
        // inputTagsInfo,
        resources
      } = this.props;
      const possibleTags = inputTags.length ? xor(flatten(resources.map((resource) => resource.tags)), inputTags) : allTags;
      this.setState({
        pickedSuggestedTags: sampleSize(possibleTags || [], 3)
      });
    };
    this.interval = setInterval(cb, 3000);
    cb();
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

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

    const renderItem = ({ title, tags, url, description }, i) => <Panel key={i}>
        <h3 className="m-b-12">{title}</h3>
        <p className="m-b-12">{description}</p>
        <p className="m-b-12">
          <a href={url} target={'_blank'}>
            <i className={`fa fa-globe`}></i> {url}
          </a>
        </p>
        <p className="m-b-12">
          <span className={`gray`}>Tags: </span>
          {tags.map((tag, _i) =>
            <span key={_i}>
              { _i !== 0 && <span>, </span>}
              <a
                className="link link-dark"
                onClick={() => this.handleAddition(tag)}>{tag}</a>
            </span>
          )}
        </p>
      </Panel>;

    // const items = (resources && !!resources.length) ? resources.map() : [];

    return (
      <div className={`container ${styles.frontendAdvisor}`}>
        <div className={`${styles.masthead}`}>
          <div className={styles.logo}></div>

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
            renderInputComponent={(props) => {
              // console.log(props);
              const onInputFocus = (e) => {
                if (window.innerWidth < 769) {
                  window.scrollTo(0, 0);
                  document.body.scrollTop = 0;
                }
                if (props.onFocus) {
                  props.onFocus(e);
                }
              };
              return (<div className="input-group tags-input-group">
                <input
                  {...props}
                  // ref={this.props.ref}
                  type="text"
                  className="form-control"
                  onFocus={onInputFocus} />

                <span className="input-group-btn">
                  <button className="btn">
                    <i className="fa fa-close"></i>
                  </button>
                </span>
              </div>);
            }}
          />
          {/* </AlwaysVisible> */}

          <Row>
            <Col xs={12}>
              <p className={`gray ${styles.tagsSuggestionLabel}`}>
                Try:&nbsp;
                <ReactCSSTransitionGroup
                  transitionEnterTimeout={1000}
                  transitionLeaveTimeout={1000}
                  transitionName={{
                    enter: 'animated',
                    enterActive: 'fadeInUp',
                    leave: 'animated',
                    leaveActive: 'fadeOutUp'
                  }} >
                  <span className={styles.suggestedTags} key={get(this.state, 'pickedSuggestedTags', []).toString()}>
                    { get(this.state, 'pickedSuggestedTags', []).map((tag, i) => (
                      <span key={tag}>
                        {i !== 0 && <span>, </span>}
                        <a
                          className="link link-dark"
                          onClick={() => this.handleAddition(tag)}>
                          {tag}
                        </a>
                      </span>
                    )) }
                  </span>
                </ReactCSSTransitionGroup>
              </p>
            </Col>
          </Row>
        </div>

        <div>
          <Pagination
            items={resources || []}
            renderItem={renderItem}
            itemsPerPage={10} />
        </div>

        {/* <CTA /> */}

        {/* <SuggestResource /> */}
      </div>
    );
  }
}
