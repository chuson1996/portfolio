import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import * as suggestResourceActions from 'redux/modules/suggestResource';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

@reduxForm({
  form: 'suggestResource'
})
@connect(
  (state) => ({
    allTags: state.tags.data,
    inputTags: state.suggestResource.tags.map(
      (text, id) => ({ text, id })
    ),
    values: (() => {
      const selector = formValueSelector('suggestResource');
      return {
        url: selector(state, 'url')
      };
    })(),
    metaData: state.suggestResource.metaData
  }),
  {
    ...suggestResourceActions
  }
)
export default class SuggestResource extends Component {
  static propTypes = {
    allTags: PropTypes.array,
    addTag: PropTypes.func,
    removeTag: PropTypes.func,
    inputTags: PropTypes.array,
    getMetaData: PropTypes.func,
    values: PropTypes.object,
    metaData: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    this.debounceGetMetaData = debounce(this.props.getMetaData, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const nextUrl = get(nextProps, 'values.url');
    const currentUrl = get(this.props, 'values.url');
    // const { getMetaData } = this.props;
    if (nextUrl !== currentUrl) {
      this.debounceGetMetaData(nextUrl);
    }
  }

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const styles = require('./SuggestResource.scss');
    const { inputTags, allTags, addTag, removeTag,
      metaData } = this.props;
    return (
      <div>
        <Modal
          onHide={this.closeModal}
          show={this.state.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Suggest a resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Field
              component="input"
              type="text"
              className="form-control"
              placeholder="Resource Url"
              // onChange={this.getMetaData}
              name="url" />
            <ReactTags
              tags={inputTags}
              suggestions={allTags}
              classNames={{
                tagInputField: `form-control`
              }}
              handleAddition={addTag}
              handleDelete={(i) => (i !== -1) && removeTag(inputTags[i].text)} />

            { metaData &&
              <div>
                <p>
                  <b>Title: </b>
                  { metaData.title }
                </p>

                <p>
                  <b>Description: </b>
                  { metaData.description }
                </p>

                <p>
                  <b>Author: </b>
                  { metaData.author }
                </p>
              </div>
            }
          </Modal.Body>
        </Modal>

        <a
          className={`btn btn-danger btn-circle ${styles.suggestBtn}`}
          onClick={this.openModal}>
          <i className="fa fa-plus"></i>
        </a>
      </div>
    );
  }
}
