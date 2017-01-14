import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import setStateWithTimeline from 'helpers/setStateWithTimeline';
import { PageLoader,
  Menu,
  MenuButton, } from 'components';

@asyncConnect([{
  promise: () => Promise.all([])
}])
@connect()
export default class App extends Component {
  static propTypes = {
    children: PropTypes.any
  };
  constructor(props) {
    super(props);
    this.state = {
      showChildren: false,
      showMenuButton: false,
      menuOpened: false
    };
  }

  pageLoaded = () => {
    const timeline = [
      ['0', () => ({ showChildren: true })],
      ['+750', () => ({ showMenuButton: true })],
    ];
    setStateWithTimeline(this, timeline);
  };

  render() {
    const {
      showMenuButton,
      showChildren,
      menuOpened
    } = this.state;
    const s = require('./App.scss');

    return (
      <div className={s.app}>
        <Helmet {...config.app}/>
        <PageLoader done={this.pageLoaded} />
        <Menu open={menuOpened} orderClose={() => this.setState({ menuOpened: false })} />
        { showMenuButton && <MenuButton
          open={menuOpened}
          onClick={() => this.setState({ menuOpened: !menuOpened })} /> }
        { showChildren && this.props.children }
      </div>
    );
  }
}
