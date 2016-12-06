import React, { Component, PropTypes } from 'react';
import {
  ReactTags,
} from 'components';
import { reduxForm, formValueSelector, Field, touch } from 'redux-form';
import { connect } from 'react-redux';
import c from 'classnames';
// import difference from 'lodash/difference';
import { load as getPreview } from 'redux/modules/preview';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import { ResourceCard } from 'components';
import get from 'lodash/get';
import isUrl from 'helpers/isUrl';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const addResourceFormSelector = formValueSelector('addResource');

const validate = ({ addResourceInputTag, resourceUrl}) => {
  const errors = {};
  if (!addResourceInputTag || !addResourceInputTag.length) {
    errors.addResourceInputTag = 'Must have 1 or more tags';
  }
  if (!resourceUrl) {
    errors.resourceUrl = 'Url cannot be empty';
  } else if (!isUrl(resourceUrl)) {
    errors.resourceUrl = 'Invalid url';
  }
  return errors;
};

// const asyncValidate = (values) => {
//   console.log(values);
//   return Promise.resolve();
// };

/* This is for reuse purpose */
@connect(
  (state) => ({
    suggestions: state.tags.data,
    addResourceInputTag: addResourceFormSelector(state, 'addResourceInputTag'),
    resourceUrl: addResourceFormSelector(state, 'resourceUrl'),
    preview: state.preview.data,
    loadingPreview: state.preview.loading,
  }),
  {
    getPreview,
    touch
  }
)
@reduxForm({
  form: 'addResource',
  initialValues: {
    addResourceInputTag: []
  },
  validate,
  // asyncValidate,
  asyncBlurFields: ['resourceUrl']
})
export default class AddResourceComponent extends Component {
  static propTypes = {
    suggestions: PropTypes.array,
    addResourceInputTag: PropTypes.array,
    getPreview: PropTypes.func.isRequired,
    preview: PropTypes.object,
    resourceUrl: PropTypes.string,
    loadingPreview: PropTypes.bool,
    valid: PropTypes.bool,
    touch: PropTypes.func.isRequired,
  };

  getPreviewInfo = ({ resourceUrl }) => {
    const { getPreview } = this.props;
    if (resourceUrl && isUrl(resourceUrl)) {
      getPreview(resourceUrl);
    }
  }

  resourceUrlInput = (field) => {
    const onChange = (e) => {
      if (field.input.onChange) {
        field.input.onChange(e);
      }
      const _resourceUrl = e.target.value;
      if (_resourceUrl && isUrl(_resourceUrl)) {
        this.getPreviewInfo({ resourceUrl: _resourceUrl });
      }
    };
    return (
      <div>
        <input
          type="text"
          className={c(
            'form-control',
            'm-b-20',
            {
              'form-control-danger': (field.meta.touched && field.meta.error),
              'form-control-success': (field.meta.touched && !field.meta.error)
            }
          )}
          placeholder={'Resource Url'}
          {...field.input}
          onChange={onChange} />
        <ReactCSSTransitionGroup
          transitionName={{
            enter: 'animated',
            enterActive: 'shake',
            leave: 'animated',
            leaveActive: 'fadeOutRightBig'
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          { field.meta.touched && field.meta.error &&
            <p className="text-danger">{field.meta.error}</p>
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  addResourceTagsInput = ({ meta, input: { onChange, onFocus, onBlur, value }}) => {
    const { addResourceInputTag, suggestions } = this.props;
    return (
      <ReactTags
        classNames={{
          // tagInputField: `${styles.tagInputField}`
        }}
        tags={addResourceInputTag || []}
        suggestions={suggestions || []}
        handleChange={onChange}
        // autocomplete
        renderInputComponent={(props) => {
          const onInputFocus = (e) => {
            if (window.innerWidth < 769) {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
            }
            if (props.onFocus) {
              props.onFocus(e);
            }
            if (onFocus) {
              onFocus(e);
            }
          };
          const onInputBlur = (e) => {
            const { touch } = this.props;
            touch('addResource', 'addResourceInputTag');
            console.log('touch');
            if (props.onBlur) {
              props.onBlur(e);
            }
            if (onBlur) {
              onBlur(value);
            }
          };
          return (
            <div>
              <div className="input-group tags-input-group">
                <input
                  {...props}
                  type="text"
                  className={c(
                    'form-control',
                    {
                      'form-control-danger': (meta.touched && meta.error),
                      'form-control-success': (meta.touched && !meta.error)
                    }
                  )}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur} />

                <span className="input-group-btn">
                  <button className="btn">
                    <i className="fa fa-close"></i>
                  </button>
                </span>
              </div>
              <ReactCSSTransitionGroup
                transitionName={{
                  enter: 'animated',
                  enterActive: 'shake',
                  leave: 'animated',
                  leaveActive: 'fadeOutRightBig'
                }}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                { meta.touched && meta.error &&
                  <p className="text-danger m-t-20">{meta.error}</p>
                }
              </ReactCSSTransitionGroup>
            </div>
          );
        }}
      />
    );
  }

  render() {
    const styles = require('./AddResource.scss');
    const {
      addResourceInputTag,
      preview,
      loadingPreview,
      resourceUrl,
      valid,
    } = this.props;
    const title = get(preview, 'title');
    const description = get(preview, 'description');

    return (
      <div
        className={c(styles.addResource)} >
        <Row>
          <Col xs={12}>
            <Field
              name={'resourceUrl'}
              component={this.resourceUrlInput} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              name={'addResourceInputTag'}
              parse={(value) => (typeof value === 'string') ? [] : value}
              component={this.addResourceTagsInput} />
          </Col>
        </Row>

        { resourceUrl && !loadingPreview && preview && valid &&
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
    );
  }
}
