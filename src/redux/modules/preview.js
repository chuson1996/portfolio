const LOAD = 'frontend-advisor/preview/LOAD';
const LOAD_SUCCESS = 'frontend-advisor/preview/LOAD_SUCCESS';
const LOAD_FAIL = 'frontend-advisor/preview/LOAD_FAIL';

const initialState = {
  loaded: false,
};


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
    default:
      return state;
  }
}

export function load(url) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/getPreview?url=${url}`)
  };
}
