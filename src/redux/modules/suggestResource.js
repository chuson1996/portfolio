import update from 'react-addons-update';

const ADD_TAG = 'frontend-advisor/suggestResource/ADD_TAG';
const REMOVE_TAG = 'frontend-advisor/suggestResource/REMOVE_TAG';
const LOAD_METADATA = 'frontend-advisor/suggestResource/LOAD_METADATA';
const LOAD_METADATA_SUCCESS = 'frontend-advisor/suggestResource/LOAD_METADATA_SUCCESS';
const LOAD_METADATA_FAIL = 'frontend-advisor/suggestResource/LOAD_METADATA_FAIL';

const inital = {
  tags: [],
  metaDataLoaded: false
};

export default function reducer(state = inital, action) {
  switch (action.type) {
    case ADD_TAG:
      return {
        ...state,
        tags: [...state.tags, action.tag]
      };
    case REMOVE_TAG:
      return (() => {
        const index = state.tags.indexOf(action.tag);
        if (index === -1) return state;

        const tags = update(state.tags, {
          $splice: [[index, 1]]
        });
        return {
          ...state,
          tags
        };
      })();
    case LOAD_METADATA:
      return {
        ...state,
        metaDataLoading: true,
      };
    case LOAD_METADATA_SUCCESS:
      return {
        ...state,
        metaDataLoading: false,
        metaDataLoaded: false,
        metaData: action.result,
        metaDataError: null
      };
    case LOAD_METADATA_FAIL:
      return {
        ...state,
        metaDataLoaded: false,
        metaDataError: action.error,
        metaData: null
      };
    default:
      return state;
  }
}

export function addTag(tag) {
  return {
    type: ADD_TAG,
    tag
  };
}

export function removeTag(tag) {
  return {
    type: REMOVE_TAG,
    tag
  };
}

export function getMetaData(url) {
  return {
    types: [LOAD_METADATA, LOAD_METADATA_SUCCESS, LOAD_METADATA_FAIL],
    promise: (client) => client.get('/getMetaData', { params: { url } })
  };
}
