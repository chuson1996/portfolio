import React, { Component } from 'react';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';

export default class Footer extends Component {
  static propTypes = {};

  render() {
    const styles = require('./Footer.scss');
    return (
      <div className={`well text-center m-b-0 ${styles.footer}`}>
        © 2016 FroDev
      </div>
    );
  }
}
