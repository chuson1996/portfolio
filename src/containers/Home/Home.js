import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import includes from 'lodash/includes';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import sampleSize from 'lodash/sampleSize';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import xor from 'lodash/xor';
import c from 'classnames';
import * as tagsActions from 'redux/modules/tags';
import * as instructionActions from 'redux/modules/isInstructionRead';
import { formValueSelector, destroy, touch as touchForm } from 'redux-form';
import { destroy as _destroyPreview } from 'redux/modules/preview';
import {
  ReactTags,
  Pagination,
  Instruction,
  LogoSVG,
  ResourceCard,
  AddResource,
} from 'components';

const addResourceFormSelector = formValueSelector('addResource');

@connect(
  (state) => ({
    user: state.auth.user,
    allTags: state.tags.data,
    inputTags: state.tags.inputTags,
    inputTagsInfo: state.tags.inputTagsInfo,
    resources: state.tags.resources,
    isInstructionRead: state.isInstructionRead,
    addResourceInputTag: addResourceFormSelector(state, 'addResourceInputTag'),
    resourceUrl: addResourceFormSelector(state, 'resourceUrl'),
    formInvalid: !get(state, 'form.addResource.syncErrors')
  }),
  {
    ...tagsActions,
    ...instructionActions,
    destroyForm: destroy,
    destroyPreview: _destroyPreview,
    push,
    touchForm,
  }
)
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    allTags: PropTypes.array,
    inputTags: PropTypes.array,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    inputTagsInfo: PropTypes.object,
    changeTags: PropTypes.func,
    loadTag: PropTypes.func,
    resources: PropTypes.array,
    readInstruction: PropTypes.func,
    isInstructionRead: PropTypes.bool,
    addResourceInputTag: PropTypes.array,
    resourceUrl: PropTypes.string,
    destroyForm: PropTypes.func.isRequired,
    destroyPreview: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    formInvalid: PropTypes.bool.isRequired,
    touchForm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showAddResourceModal: false
    };
  }

  componentDidMount() {
    const cb = () => {
      const {
        allTags,
        inputTags,
        resources
      } = this.props;
      const possibleTags = (inputTags && inputTags.length) ?
        xor(flatten(resources.map((resource) => resource.tags)), inputTags) :
        allTags;
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

  openAddResourceModal = () => {
    /* Check if user is logged. If not, redirect to Login page */
    const { user, push } = this.props;
    if (user) {
      this.setState({
        showAddResourceModal: true
      });
    } else {
      push('/login');
    }
  };

  closeAddResourceModal = () => {
    this.setState({
      showAddResourceModal: false
    });
  };

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

  submit = () => {
    const { addResourceInputTag, resourceUrl, destroyForm, destroyPreview, touchForm } = this.props;
    touchForm('addResource');
    console.log(addResourceInputTag, resourceUrl);
    this.setState({
      ...this.state,
      showSuccessMessage: true,
      showAddResourceModal: false
    });
    destroyForm('addResource');
    destroyPreview();

    this.successMessageTimeout = setTimeout(() => {
      this.setState({
        ...this.state,
        showSuccessMessage: false
      });
    }, 3000);
  };

  render() {
    const styles = require('./Home.scss');
    const {
      allTags,
      inputTags,
      resources,
      readInstruction,
      isInstructionRead,
      // addResourceInputTag,
      // resourceUrl,
      formInvalid,
      destroyForm,
      destroyPreview,
    } = this.props;

    const possibleTags = inputTags.length ? xor(flatten(resources.map((resource) => resource.tags)), inputTags) : allTags;

    const renderItem = (props, i) => <ResourceCard key={i} {...props} />;

    return (
      <div className={`container ${styles.home}`}>
        <div className={`${styles.masthead}`}>
          {/* <div className={`${styles.logo} hidden-xs`}></div> */}
          <LogoSVG className={c('hidden-xs', styles.logo)} />

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
              className={c('hidden-xs', styles.instruction)}
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

        <a
          onClick={this.openAddResourceModal}
          className={c(
            'btn btn-circle btn-success',
            'hidden-xs',
            styles.addResourceBtn
          )}>
          <i className="material-icons">add_to_photos</i>
        </a>

        <Modal
          show={this.state.showAddResourceModal}
          className={c(styles.addResourceModal)}
          onHide={this.closeAddResourceModal} >
          <Modal.Header>
            <h1 className={c('text-center', 'text-primary')}>Add Resource</h1>
          </Modal.Header>
          <Modal.Body>
            <AddResource />

            <div className={c('text-right m-t-40', styles.controlBtns)}>
              <Button
                bsStyle={'danger'}
                onClick={() => {
                  destroyForm('addResource');
                  destroyPreview();
                }} >
                <i className="material-icons">delete</i>
                Discard
              </Button>
              <Button
                disabled={!formInvalid}
                onClick={this.submit}
                bsStyle={'success'}
                className={c('m-l-23')}>
                <i className="material-icons">send</i>
                Post
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <ReactCSSTransitionGroup
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
          transitionName={{
            enter: 'animatedEnter',
            enterActive: 'fadeInUp',
            leave: 'animated',
            leaveActive: 'fadeOutDown'
          }} >
          { get(this.state, 'showSuccessMessage') &&
            <div className={c(styles.successMessage)}>
              <h2 className="text-center">
                Thank you for sharing!
                <i
                  onClick={() => {
                    if (this.successMessageTimeout) {
                      clearTimeout(this.successMessageTimeout);
                      this.setState({
                        ...this.state,
                        showSuccessMessage: false
                      });
                    }
                  }}
                  className="material-icons pull-right" >
                  close
                </i>
              </h2>
            </div>
          }
        </ReactCSSTransitionGroup>

        {/* <SuggestResource /> */}
      </div>
    );
  }
}
