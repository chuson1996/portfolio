import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import setStateWithTimeline from 'helpers/setStateWithTimeline';
import log from 'helpers/log';
import { RouteTransition } from 'react-router-transition';
import { spring, presets } from 'react-motion';
import { PageLoader,
  Menu,
  MenuButton, } from 'components';

const wobbly = (val) => spring(val, presets.wobbly);

@asyncConnect([{
  promise: () => Promise.all([])
}])
@connect()
export default class App extends Component {
  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
    pathnameBeforeTransitions: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.state = {
      slideRight: false,
      showChildren: false,
      showMenuButton: false,
      menuOpened: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const routeOrder = ['/', '/projects'];
    const { location: { pathname: now } } = nextProps;
    const { location: { pathname: before } } = this.props;

    this.setState({
      slideRight: log(`before: ${before}: `, routeOrder.indexOf(before)) < log(`now: ${now}: `, routeOrder.indexOf(now))
    });
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
      menuOpened,
      slideRight,
    } = this.state;
    const { location: { action, pathname } } = this.props;
    const s = require('./App.scss');

    const extraClassName = {
      '/': s.menuButtonHomePage,
      '/projects': s.menuButtonProjectPage
    };

    const atEnter = () => {
      if (action === 'POP') return { x: 0 };
      if (/^\/.+\/.+$/.test(pathname)) return { x: 0 };
      return { x: slideRight ? 100 : -100 };
    };

    const atLeave = () => {
      if (/^\/.+\/.+$/.test(pathname)) return { x: spring(0) };
      return { x: spring(slideRight ? -100 : 100) };
    };

    return (
      <div className={s.app}>
        <Helmet {...config.app}/>
        <PageLoader done={this.pageLoaded} />
        <Menu open={menuOpened} orderClose={() => this.setState({ menuOpened: false })} />
        { showMenuButton && <MenuButton
          extraClassName={extraClassName[this.props.location.pathname]}
          open={menuOpened}
          onClick={() => this.setState({ menuOpened: !menuOpened })} /> }
        { showChildren && <RouteTransition
            pathname={this.props.location.pathname}
            atEnter={atEnter()}
            atActive={{ x: spring(0) }}
            atLeave={atLeave()}
            mapStyles={({ x }) => ({ transform: `translateX(${x}vw)` })} >
          { this.props.children }
        </RouteTransition> }
      </div>
    );
  }
}
