import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {connect} from 'react-redux';
import { unReadInstruction } from 'redux/modules/isInstructionRead';
import c from 'classnames';
import get from 'lodash/get';

@connect(null, {
  unReadInstruction
})
export default class Header extends Component {
  static propTypes = {
    unReadInstruction: PropTypes.func
  };

  componentDidMount() {
    this.scrollListener = window.addEventListener('scroll', () => {
      if (window.scrollY > 220) {
        this.setState({
          scrolled: true
        });
      } else {
        this.setState({
          scrolled: false
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  render() {
    const styles = require('./Header.scss');

    return (
      <Navbar fixedTop className={styles.header}>
        <Nav pullRight className={c('hidden-xs', styles.navNormalScreen, { [styles.scrolled]: get(this.state, 'scrolled')})}>
          <NavItem>Search</NavItem>
          <NavItem onClick={this.props.unReadInstruction}>How to use</NavItem>
          <NavItem>About</NavItem>
        </Nav>

        <Nav className={c('visible-xs', styles.navSmallScreen, { [styles.scrolled]: get(this.state, 'scrolled')})}>
          <img src={require('./Logo.png')} alt="logo" className={styles.logo}/>
        </Nav>
      </Navbar>
    );
  }
}
