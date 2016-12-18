import React from 'react';
import {
  IndexRoute,
  Route} from 'react-router';
import {
  isLoaded as isAuthLoaded,
  load as loadAuth
} from 'redux/modules/auth';
import {
    App,
    About,
    NotFound,
    Home,
    Instruction,
    AddResource,
    Login,
    Download,
    Profile,
    Bookmark,
  } from 'containers';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/login');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth())
        .then(checkAuth)
        .catch(checkAuth);
    } else {
      checkAuth();
    }
  };

  const requireLoginProp = { onEnter: requireLogin };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>
      <Route path="/instruction" component={Instruction}/>
      <Route path="/about" component={About}/>
      <Route path="/login" component={Login}/>
      <Route path="/download" component={Download}/>

      <Route path="/add"
        component={AddResource}
        {...requireLoginProp} />
      <Route path="/profile"
        component={Profile}
        {...requireLoginProp} />
      <Route path="/bookmark"
        component={Bookmark}
        {...requireLoginProp} />

      { /* Routes requiring login */ }
      {/* <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route> */}

      { /* Routes */ }
      {/* <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="survey" component={Survey}/>
      <Route path="widgets" component={Widgets}/> */}

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
