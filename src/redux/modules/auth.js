/* globals FB */
const LOAD = 'frontend-advisor/auth/LOAD';
const LOAD_SUCCESS = 'frontend-advisor/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'frontend-advisor/auth/LOAD_FAIL';
const LOGIN = 'frontend-advisor/auth/LOGIN';
const LOGIN_SUCCESS = 'frontend-advisor/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'frontend-advisor/auth/LOGIN_FAIL';
const FB_LOGIN = 'frontend-advisor/auth/FB_LOGIN';
const FB_LOGIN_SUCCESS = 'frontend-advisor/auth/FB_LOGIN_SUCCESS';
const FB_LOGIN_FAIL = 'frontend-advisor/auth/FB_LOGIN_FAIL';
const LOGOUT = 'frontend-advisor/auth/LOGOUT';
const LOGOUT_SUCCESS = 'frontend-advisor/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'frontend-advisor/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case FB_LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case FB_LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        fbUser: action.result
      };
    case FB_LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

// export function login(name) {
//   return {
//     types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
//     promise: (client) => client.post('/login', {
//       data: {
//         name: name
//       }
//     })
//   };
// }

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/logout')
  };
}
