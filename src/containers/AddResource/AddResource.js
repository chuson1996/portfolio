import React, { Component, PropTypes } from 'react';
import c from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { AddResource as AddResourceComponent } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { formValueSelector, destroy, touch as touchForm } from 'redux-form';
import { connect } from 'react-redux';
import { destroy as destroyPreview } from 'redux/modules/preview';
import get from 'lodash/get';
import { save as saveResource } from 'redux/modules/userResources';

const addResourceFormSelector = formValueSelector('addResource');

@connect(
  (state) => ({
    addResourceInputTag: addResourceFormSelector(state, 'addResourceInputTag'),
    resourceUrl: addResourceFormSelector(state, 'resourceUrl'),
    formValid: !get(state, 'form.addResource.syncErrors')
  }),
  {
    destroyForm: destroy,
    destroyPreview,
    touchForm,
    saveResource
  }
)
export default class AddResource extends Component {
  static propTypes = {
    resourceUrl: PropTypes.string,
    addResourceInputTag: PropTypes.array,
    destroyForm: PropTypes.func.isRequired,
    destroyPreview: PropTypes.func.isRequired,
    formValid: PropTypes.bool.isRequired,
    touchForm: PropTypes.func.isRequired,
    saveResource: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }

  submit = () => {
    const {
      resourceUrl,
      addResourceInputTag,
      formValid,
      touchForm,
      destroyForm,
      destroyPreview,
      saveResource,
    } = this.props;
    touchForm('addResource');


    if (formValid) {
      /* Form valid */
      saveResource({
        resourceUrl,
        tags: addResourceInputTag
      }).then(() => {
        destroyForm('addResource');
        destroyPreview();

        this.setState({
          submitted: true,
        });

        setTimeout(() => {
          this.setState({
            submitted: false
          });
        }, 3000);
        return;
      });
    }

    /* Form invalid */
  };

  render() {
    const {
      // resourceUrl,
      // addResourceInputTag,
      destroyForm,
      formValid,
      destroyPreview,
    } = this.props;
    const styles = require('./AddResource.scss');

    return (
      <div>
        <Navbar fixedTop className={c(styles.header, 'header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-left">Add Resource</h4>
            </NavItem>
          </Nav>
          <Nav
            bsStyle="pills"
            className={c(styles.navbarRight, 'text-right')}>
            <NavItem
              onClick={() => {
                destroyForm('addResource');
                destroyPreview();
              }}
              className={c(styles.deleteBtn)}>
              <i className="material-icons">delete</i>
            </NavItem>
            <NavItem
              className={c(
                styles.submitBtn,
                {
                  [ styles.disabled ]: !formValid
                }
              )}
              onClick={() => this.submit()} >
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
              <h1>Saved!</h1>
              <a className={c(styles.circleBtn)}>
                <i className="material-icons">check</i>
              </a>
            </div>
          }
        </ReactCSSTransitionGroup>

        <div className={c('container', styles.addResource)}>
          <AddResourceComponent />
        </div>
      </div>
    );
  }
}
