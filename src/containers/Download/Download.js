import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import c from 'classnames';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class Download extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="container bodyContainer text-center">
        <Helmet title="Download"/>
        <Navbar fixedTop className={c('header-small')}>
          <Nav>
            <NavItem>
              <h4 className="text-center">Download</h4>
            </NavItem>
          </Nav>
        </Navbar>

        <h2>Say hi to FroDev Chrome Extension</h2>
        <br/>
        <p>This is the current beta version and it is not ready to be on Chrome Web Store yet. You would have to download the extension and install it. Take a look at this <a href="http://stackoverflow.com/questions/24577024/install-chrome-extension-not-in-the-store">link</a> for instruction.</p>
        <a href="https://github.com/chuson1996/frodev-chrome-extension/archive/master.zip">Download FroDev Chrome Extension v1.0</a>
      </div>
    );
  }
}
