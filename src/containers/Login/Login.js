import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import c from 'classnames';
import { asyncConnect } from 'redux-async-connect';
import { load as getResourcesCount } from 'redux/modules/resourcesCount';
import { connect } from 'react-redux';
import { LogoSVG } from 'components';

@asyncConnect([{
  promise: ({ store: { dispatch }}) => {
    return Promise.all([
      dispatch(getResourcesCount())
    ]);
  }
}])
@connect(
  (state) => ({
    resourcesCount: state.resourcesCount.data
  })
)
export default class Login extends Component {
  static propTypes = {
    resourcesCount: PropTypes.number
  };

  githubLogin() {
    window.location.href = '/api/auth/github';
  }

  render() {
    const styles = require('./Login.scss');
    const { resourcesCount } = this.props;

    return (
      <div className={c('container', styles.login)}>
        <Navbar fixedTop className={c('header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-center">Login</h4>
            </NavItem>
          </Nav>
        </Navbar>

        <Row>
          <Col xs={12} className={c('bodyContainer', 'text-center')}>
            <h1 className={c('m-b-35', 'hidden-xs')}>LOGIN</h1>
            <LogoSVG className={c('visible-xs', 'm-b-35', styles.logo)} />
            <p className={c('m-b-35')}>Frodev contains {resourcesCount} wondrous links about front-end development. By logging in, you can save your own links and share them if you want.</p>
            <Button
              onClick={this.githubLogin}
              className={c(styles.githubLoginBtn, 'm-b-10')}>
              <i className="fa fa-github"></i>
              Login with Github
            </Button>
            {/* <Button
              disabled
              bsStyle={'danger'}
              className={c(styles.googleLoginBtn)}>
              <i className="fa fa-google"></i>
              Login with Google
            </Button> */}
          </Col>
        </Row>
      </div>
    );
  }
}
