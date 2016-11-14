import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {connect} from 'react-redux';
import { unReadInstruction } from 'redux/modules/isInstructionRead';

@connect(null, {
  unReadInstruction
})
export default class Header extends Component {
  static propTypes = {
    unReadInstruction: PropTypes.func
  };

  render() {
    const style = require('./Header.scss');

    return (
      <Navbar fixedTop className={style.header}>
        <Nav pullRight className={'hidden-xs'}>
          <NavItem>Search</NavItem>
          <NavItem onClick={this.props.unReadInstruction}>How to use</NavItem>
          <NavItem>About</NavItem>
        </Nav>

        <Nav className={'visible-xs'}>
          <img src={require('./Logo.png')} alt="logo" className={style.logo}/>
        </Nav>
      </Navbar>
    );
  }
}
