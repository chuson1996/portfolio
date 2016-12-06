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
            <Link to={`/`} className={`${styles.footerBtn} col-xs-3 text-center`}>
              <i className="material-icons">search</i>
            </Link>
            <Link to={`/add`} className={`${styles.footerBtn} col-xs-3 text-center`}>
              <i className="material-icons">library_add</i>
            </Link>
            <Link to={`/instruction`} className={`${styles.footerBtn} col-xs-3 text-center`}>
              <i className="material-icons">help_outline</i>
            </Link>
            {/* <Link to={`/about`} className={`${styles.footerBtn} col-xs-3 text-center`}>
              <i className="material-icons">info_outline</i>
            </Link> */}
            <Link to={`/login`} className={`${styles.footerBtn} col-xs-3 text-center`}>
              <i className="material-icons">account_circle</i>
            </Link>
          </Row>
        </Navbar>
      </div>
    );
  }
}
