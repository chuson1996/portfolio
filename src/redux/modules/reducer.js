import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

// import auth from './auth';
import {reducer as form} from 'redux-form';
import tags from './tags';
import suggestResource from './suggestResource';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  // auth,
  form,
  tags,
  suggestResource
});
