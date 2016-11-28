import React, { Component, PropTypes } from 'react';
// import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import * as tagsActions from 'redux/modules/tags';
import * as instructionActions from 'redux/modules/isInstructionRead';
// import { asyncConnect } from 'redux-async-connect';
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
import cl from 'classnames';
import {
  // AlwaysVisible,
  // CTA,
  // SuggestResource,
  ReactTags,
  Pagination,
  // Tag,
  Instruction,
  LogoSVG,
  ResourceCard,
} from 'components';

@connect(
  (state) => ({
    allTags: state.tags.data,
    inputTags: state.tags.inputTags,
    inputTagsInfo: state.tags.inputTagsInfo,
    resources: state.tags.resources,
    isInstructionRead: state.isInstructionRead,
  }),
  {
    ...tagsActions,
    ...instructionActions,
  }
)
export default class Home extends Component {
  static propTypes = {
    allTags: PropTypes.array,
    inputTags: PropTypes.array,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    inputTagsInfo: PropTypes.object,
    changeTags: PropTypes.func,
    loadTag: PropTypes.func,
    resources: PropTypes.array,
    readInstruction: PropTypes.func,
    isInstructionRead: PropTypes.bool
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
    // const { isTagLoaded } = tagsActions;
    const {
      addTag,
      allTags,
      // inputTagsInfo,
      loadTag
    } = this.props;
    if (includes(allTags, tag)) {
      addTag(tag);
      /* Load even when it's not available */
      loadTag(tag);

      /* Only load when it's not available */
      // if (!isTagLoaded(inputTagsInfo, tag)) {
      //   loadTag(tag);
      // }
    }
  };

  handleChange = (tags) => {
    console.log('Handle change: ', tags);
    // const { isTagLoaded } = tagsActions;
    const {
      // inputTagsInfo,
      loadTag
    } = this.props;

    this.props.changeTags(tags);
    tags.forEach((tag) => {
      /* Load even when it's not available */
      loadTag(tag);

      /* Only load when it's not available */
      // if (!isTagLoaded(inputTagsInfo, tag)) {
      //   loadTag(tag);
      // }
    });
  };

  render() {
    const styles = require('./Home.scss');
    const {
      allTags,
      inputTags,
      // removeTag,
      // inputTagsInfo,
      resources,
      readInstruction,
      isInstructionRead,
    } = this.props;

    const possibleTags = inputTags.length ? xor(flatten(resources.map((resource) => resource.tags)), inputTags) : allTags;

    const renderItem = (props, i) =>
      <ResourceCard key={i} {...props} />;

    // const items = (resources && !!resources.length) ? resources.map() : [];

    return (
      <div className={`container ${styles.home}`}>
        <div className={`${styles.masthead}`}>
          {/* <div className={`${styles.logo} hidden-xs`}></div> */}
          <LogoSVG className={cl('hidden-xs', styles.logo)} />

          <ReactCSSTransitionGroup
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
            transitionName={{
              enter: 'animatedEnter',
              enterActive: 'bounceInLeft',
              leave: 'animated',
              leaveActive: 'bounceOutRight'
            }} >
            { !isInstructionRead && <Instruction
              className={cl('hidden-xs', styles.instruction)}
              read={readInstruction} />
            }
          </ReactCSSTransitionGroup>

          <ReactTags
            classNames={{
              tagInputField: `${styles.tagInputField}`
            }}
            tags={inputTags}
            suggestions={possibleTags}
            handleChange={this.handleChange}
            autocomplete
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
