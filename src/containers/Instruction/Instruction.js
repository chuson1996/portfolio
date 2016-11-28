import React, { Component, PropTypes } from 'react';
import { Instruction as InstructionComponent } from 'components';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import c from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

@connect(null, { push })
export default class Instruction extends Component {
  static propTypes = {
    push: PropTypes.func
  };

  componentDidMount() {
    console.log(window.innerWidth);
    if (window.innerWidth >= 768) {
      this.props.push('/');
    }
  }

  render() {
    const styles = require('./Instruction.scss');

    return (
      <div className={`${styles.instruction} visible-xs`}>
        <Navbar fixedTop className={c(styles.header, 'header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-center">Instruction</h4>
            </NavItem>
          </Nav>
        </Navbar>
        <InstructionComponent />
      </div>
    );
  }
}
