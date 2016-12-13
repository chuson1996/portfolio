import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {connect} from 'react-redux';
import { unReadInstruction } from 'redux/modules/isInstructionRead';
import { push } from 'react-router-redux';
import c from 'classnames';
import get from 'lodash/get';
// import {IndexLinkContainer} from 'react-router-bootstrap';
import {Link} from 'react-router';

@connect((state) => ({
  path: get(state, 'routing.locationBeforeTransitions.pathname'),
  user: state.auth.user
}), {
  unReadInstruction,
  push
})
export default class Header extends Component {
  static propTypes = {
    unReadInstruction: PropTypes.func,
    path: PropTypes.string,
    user: PropTypes.object,
    push: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.scrollListener = () => {
      if (window.scrollY > 220) {
        this.setState({
          scrolled: true
        });
      } else {
        this.setState({
          scrolled: false
        });
      }
    };
    window.addEventListener('scroll', this.scrollListener);
  }

  componentWillUnmount() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  render() {
    const styles = require('./Header.scss');
    const {path, push, unReadInstruction, user} = this.props;

    const MobileHeader = (
      <Nav className={c('visible-xs', styles.navSmallScreen, { [styles.scrolled]: get(this.state, 'scrolled')})}>
        <Link to={'/'}>
          <img src={require('./Logo.png')} alt="logo" className={styles.logo}/>
        </Link>
      </Nav>
    );

    const defaultHeader = (
      <Nav pullRight className={c('hidden-xs', styles.navNormalScreen, { [styles.scrolled]: get(this.state, 'scrolled')})}>
        <NavItem onClick={() => push('/')}>Search</NavItem>
        <NavItem onClick={() => push('/download')}>Download</NavItem>
        <NavItem onClick={() => {
          push('/');
          unReadInstruction();
        }}>Instruction</NavItem>
        <NavItem onClick={() => push('/about')}>About</NavItem>
        { user ?
          <NavItem className={c(styles.avatarContainer)}>
            <img src={user.avatarUrl} className={c('avatar')} alt="avatar"/>
          </NavItem> :
          <NavItem onClick={() => push('/login')}>Login</NavItem>
        }
      </Nav>
    );

    /* The header for mobile screens only show on the Home Page */
    return (
      <Navbar fixedTop className={c(styles.header)}>
        { defaultHeader }

        { path === '/' && MobileHeader }
      </Navbar>
    );
  }
}
