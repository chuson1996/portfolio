const SAVE = 'frontend-advisor/userResources/SAVE';
const SAVE_SUCCESS = 'frontend-advisor/userResources/SAVE_SUCCESS';
const SAVE_FAIL = 'frontend-advisor/userResources/SAVE_FAIL';

const initialState = {};


export default function reducer(state = initialState, action) {
  switch (action.type) {
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
