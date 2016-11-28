import React, { Component, PropTypes } from 'react';
import {
  ReactTags,
} from 'components';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import { connect } from 'react-redux';
import c from 'classnames';
import difference from 'lodash/difference';
import { load as _getPreview } from 'redux/modules/preview';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import NavItem from 'react-bootstrap/lib/NavItem';
import Panel from 'react-bootstrap/lib/Panel';
import { ResourceCard } from 'components';
import get from 'lodash/get';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const addResourceFormSelector = formValueSelector('addResource');

@connect(
  (state) => ({
    suggestions: state.tags.data,
    addResourceInputTag: addResourceFormSelector(state, 'addResourceInputTag'),
    resourceUrl: addResourceFormSelector(state, 'resourceUrl'),
    preview: state.preview.data,
    loadingPreview: state.preview.loading,
  }),
  {
    getPreview: _getPreview
  }
)
@reduxForm({
  form: 'addResource',
  initialValues: {
    addResourceInputTag: []
  }
})
export default class AddResource extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    addResourceInputTag: PropTypes.array,
    array: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    getPreview: PropTypes.func.isRequired,
    preview: PropTypes.object,
    resourceUrl: PropTypes.string,
    loadingPreview: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }

  getPreviewInfo = ({ resourceUrl }) => {
    const { getPreview } = this.props;
    if (resourceUrl) {
      getPreview(resourceUrl);
    }
  };

  submit = (values) => {
    console.log(values);
    this.setState({
      submitted: true,
    });

    setTimeout(() => {
      this.setState({
        submitted: false
      });
    }, 3000);
  };

  render() {
    const {
      suggestions,
      addResourceInputTag,
      array: { push, remove },
      handleSubmit,
      preview,
      loadingPreview,
      resourceUrl,
    } = this.props;
    const styles = require('./AddResource.scss');
    const title = get(preview, 'title');
    const description = get(preview, 'description');

    const addOrRemoveItem = (newArr) => {
      const oldArr = addResourceInputTag;
      if (newArr.length > oldArr.length) {
        const diff = difference(newArr, addResourceInputTag)[0];
        console.log('Push ', diff);
        /* Insert */
        push('addResourceInputTag', diff);
      } else if (newArr.length < oldArr.length) {
        /* Remove */
        const diff = difference(addResourceInputTag, newArr)[0];
        console.log('Remove ', diff);
        // Find index
        const index = oldArr.indexOf(diff);
        remove('addResourceInputTag', index);
      }
    };

    return (
      <form onBlur={() => this.getPreviewInfo({ resourceUrl })} onSubmit={handleSubmit(this.submit)}>
        <Navbar fixedTop className={c(styles.header, 'header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-left">Add Resource</h4>
            </NavItem>
          </Nav>
          <Nav
            bsStyle="pills"
            className={c(styles.navbarRight, 'text-right')}>
            <NavItem className={c(styles.deleteBtn)}>
              <i className="material-icons">delete</i>
            </NavItem>
            <NavItem
              className={c(styles.submitBtn)}
              onClick={handleSubmit(this.submit)} >
              <i className="material-icons">send</i>
            </NavItem>
          </Nav>
        </Navbar>

        <ReactCSSTransitionGroup
          transitionName={{
            enter: 'animatedEnter',
            enterActive: 'fadeIn',
            leave: 'animated',
            leaveActive: 'fadeOut'
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          { this.state.submitted &&
            <div className={c(styles.successMessage)}>
              <h1>Thank you for sharing!</h1>
              <a className={c(styles.circleBtn)}>
                <i className="material-icons">check</i>
              </a>
            </div>
          }
        </ReactCSSTransitionGroup>

        <div
          className={c('container', styles.addResource)} >
          <Row>
            <Col xs={12}>
              <Field
                className={c('form-control', 'm-b-20')}
                name={'resourceUrl'}
                placeholder={'Resource Url'}
                component={'input'} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ReactTags
                classNames={{
                  // tagInputField: `${styles.tagInputField}`
                }}
                tags={addResourceInputTag || []}
                suggestions={suggestions || []}
                handleChange={(val) => addOrRemoveItem(val)}
                autocomplete
                renderInputComponent={(props) => {
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
            </Col>
          </Row>

          { resourceUrl && !loadingPreview && preview &&
            <Row>
              <Col xs={12}>
                <Panel
                  header={<div><h3>Preview</h3></div>}
                  className={c(styles.preview)}>
                  <div className={c(styles.content)}>
                    <ResourceCard
                      title={title}
                      description={description}
                      url={resourceUrl}
                      tags={addResourceInputTag} />
                  </div>
                </Panel>
              </Col>
            </Row>
          }
        </div>
      </form>
    );
  }
}
