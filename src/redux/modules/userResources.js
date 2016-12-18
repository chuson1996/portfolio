import compareDesc from 'date-fns/compare_desc';

const LOAD = 'frontend-advisor/userResources/LOAD';
const LOAD_SUCCESS = 'frontend-advisor/userResources/LOAD_SUCCESS';
const LOAD_FAIL = 'frontend-advisor/userResources/LOAD_FAIL';
const SAVE = 'frontend-advisor/userResources/SAVE';
const SAVE_SUCCESS = 'frontend-advisor/userResources/SAVE_SUCCESS';
const SAVE_FAIL = 'frontend-advisor/userResources/SAVE_FAIL';

const initialState = {};

export default function reducer(state = initialState, action) {
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
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SAVE:
      return {
        ...state,
        saving: true
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        saved: true,
        data: action.result
      };
    case SAVE_FAIL:
      return {
        ...state,
        saving: false,
        saved: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadResources')
      .then((resources) => resources.sort((a, b) => compareDesc(new Date(a.createdAt), new Date(b.createdAt))))
  };
}

export function save({ resourceUrl, tags}) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) => client.post(`/saveResource`, {
      data: {
        resourceUrl,
        tags
      }
    })
  };
}
