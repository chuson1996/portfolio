import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { IndexLink } from 'react-router';
// import { LinkContainer } from 'react-router-bootstrap';
// import Navbar from 'react-bootstrap/lib/Navbar';
// import Nav from 'react-bootstrap/lib/Nav';
// import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
// import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import {
  isLoaded as isAuthLoaded,
  load as loadAuth,
} from 'redux/modules/auth';
// import { InfoBar } from 'components';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import last from 'lodash/last';
import { Footer, Header } from 'components';
import ProgressBar from 'react-progress-bar-plus';
import { isGlobalLoading } from 'redux/middleware/clientMiddleware';
// import random from 'lodash/random';
import * as tagsActions from 'redux/modules/tags';

@asyncConnect([{
  promise: ({ store: { dispatch, getState }}) => {
    const { isLoaded: areTagsLoaded,
      load: loadTags } = tagsActions;

    const promises = [];

    if (!areTagsLoaded(getState())) {
      promises.push(dispatch(loadTags()));
    }

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    isGlobalLoading: isGlobalLoading(state)
  }),
  {
    // logout,
    pushState: push
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    // user: PropTypes.object,
    // logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    location: PropTypes.object,
    isGlobalLoading: PropTypes.bool
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    // const {
    //   // user,
    //   location: { pathname }
    // } = this.props;
    const styles = require('./App.scss');
    // const segment = last(pathname.split('/')) || 'root';
    const { isGlobalLoading: isLoading } = this.props;

    return (
      <div className={styles.app}>
        <ProgressBar
          percent={isLoading ? 0 : 100}
          autoIncrement
          intervalTime={500}
          spinner={false} />

        <Helmet {...config.app}/>
        {/* <div id="fb-root"></div>
        <script src={config.fbSDK}></script> */}
        <div className={styles.appContent}>
          <Header />
          {this.props.children}
          {/* <ReactCSSTransitionGroup
            transitionName={{
              enter: styles['page-enter'],
              enterActive: styles['page-enter-active'],
              leave: styles['page-leave'],
              leaveActive: styles['page-leave-active']
            }}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {React.cloneElement(this.props.children, {key: segment})}
          </ReactCSSTransitionGroup> */}
        </div>
        {/* <InfoBar/> */}

        <Footer/>
      </div>
    );
  }
}
