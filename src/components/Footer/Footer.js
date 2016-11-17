import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

@connect(null, { push })
export default class Footer extends Component {
  static propTypes = {
    push: PropTypes.func
  };

  render() {
    const styles = require('./Footer.scss');

    return (
      <div>
        <Navbar inverse className={`${styles.footer} hidden-xs`}>
          <Nav>
            <NavItem>© 2016 FroDev</NavItem>
          </Nav>
        </Navbar>
        <Navbar fixedBottom inverse className={`${styles.footer} visible-xs`}>
          <Row>
            <a onClick={() => this.props.push('/')} className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-search"></i>
            </a>
            <a onClick={() => this.props.push('/instruction')} className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-question"></i>
            </a>
            <a className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-info"></i>
            </a>
          </Row>
        </Navbar>
      </div>
    );
  }
}
