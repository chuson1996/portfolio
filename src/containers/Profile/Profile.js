import React, {Component, PropTypes} from 'react';
import c from 'classnames';
import Helmet from 'react-helmet';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import { connect } from 'react-redux';
import {Link} from 'react-router';

@connect(
  (state) => ({
    user: state.auth.user
  })
)
export default class Profile extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const s = require('./Profile.scss');
    const { user } = this.props;

    return (
      <div className={c('container bodyContainer fullScreen')}>
        <Helmet title="Profile"/>
        <Navbar fixedTop className={c('header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-center">Profile</h4>
            </NavItem>
          </Nav>
        </Navbar>

        <div className={c(s.userInfo)}>
          <img className={c('img-circle m-r-20', s.avatar)} src={user.avatarUrl}/>
          <p className="lead inline">{user.displayName}</p>
        </div>

        <Row>
          <ul className={c(s.buttonsList)}>
            <li><Link to={'/bookmark'}>Bookmark</Link></li>
            <li><a>Logout</a></li>
          </ul>
        </Row>
      </div>
    );
  }
}
