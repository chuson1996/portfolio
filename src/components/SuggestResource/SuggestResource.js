import React, { Component, PropTypes } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { Field, reduxForm, getFormValues } from 'redux-form';
// import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import * as suggestResourceActions from 'redux/modules/suggestResource';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import { Loader, TagInput } from 'components';
import Button from 'react-bootstrap/lib/Button';
import config from 'config';
import Helmet from 'react-helmet';
// import update from 'react-addons-update';

@reduxForm({
  form: 'suggestResource',
  initialValues: {
    tags: []
  }
})
@connect(
  (state) => ({
    allTags: state.tags.data,
    inputTags: state.suggestResource.tags.map(
      (text, id) => ({ text, id })
    ),
    values: getFormValues('suggestResource')(state),
    metaData: state.suggestResource.metaData,
    metaDataLoading: state.suggestResource.metaDataLoading
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
    metaData: PropTypes.object,
    metaDataLoading: PropTypes.bool,
    handleSubmit: PropTypes.func,
    postSuggestion: PropTypes.func,
    reset: PropTypes.func
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

  handleSubmit = (values) => {
    console.log(values);
    const {postSuggestion, reset} = this.props;
    const { url, email, tags } = values;
    postSuggestion({ url, email, tags }).then(reset);
  }

  render() {
    const styles = require('./SuggestResource.scss');
    const { /* inputTags, allTags, addTag, removeTag, */
      metaData, metaDataLoading, handleSubmit, values: {url} } = this.props;

    return (
      <div>
        <Helmet {...config.app}/>
        <Modal
          onHide={this.closeModal}
          show={this.state.showModal}>
          <Modal.Header closeButton>
            <Modal.Title>Suggest a resource</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(this.handleSubmit)}>
              <Field
                component="input"
                type="email"
                placeholder="Your email"
                className="form-control"
                name="email" />

              <Field
                component="input"
                type="text"
                className="form-control"
                placeholder="Resource Url"
                name="url" />

              <Field
                name="tags"
                component={TagInput} />

              { metaDataLoading && <Loader />}
              { !metaDataLoading && !!url && metaData &&
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

              <Button bsStyle={`success`} type="submit">Suggest</Button>
            </form>
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
