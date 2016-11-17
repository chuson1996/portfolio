import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Row from 'react-bootstrap/lib/Row';
import { Link } from 'react-router';

export default class Footer extends Component {
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
            <Link to={`/`} className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-search"></i>
            </Link>
            <Link to={`/instruction`} className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-question"></i>
            </Link>
            <Link to={`/about`} className={`${styles.footerBtn} col-xs-4`}>
              <i className="fa fa-info"></i>
            </Link>
          </Row>
        </Navbar>
      </div>
    );
  }
}
