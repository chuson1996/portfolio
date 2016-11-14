import findIndex from 'lodash/findIndex';
import update from 'react-addons-update';
import intersectionBy from 'lodash/intersectionBy';
import get from 'lodash/get';

const LOAD = 'frontend-advisor/tags/LOAD';
const LOAD_SUCCESS = 'frontend-advisor/tags/LOAD_SUCCESS';
const LOAD_FAIL = 'frontend-advisor/tags/LOAD_FAIL';
const LOAD_TAG = 'frontend-advisor/tags/LOAD_TAG';
const LOAD_TAG_SUCCESS = 'frontend-advisor/tags/LOAD_TAG_SUCCESS';
const LOAD_TAG_FAIL = 'frontend-advisor/tags/LOAD_TAG_FAIL';
const ADD_TAG = 'frontend-advisor/tags/ADD_TAG';
const REMOVE_TAG = 'frontend-advisor/tags/REMOVE_TAG';
const CHANGE_TAGS = 'frontend-advisor/tags/CHANGE_TAGS';

const initialState = {
  loaded: false,
  editing: {},
  inputTags: [],
  inputTagsInfo: {}
};

const getResources = (state, { inputTags, inputTagsInfo }) => {
  const _inputTags = (inputTags || state.inputTags);
  const _inputTagsInfo = inputTagsInfo || state.inputTagsInfo;
  return intersectionBy(..._inputTags.map((tag) => {
    return get(_inputTagsInfo, `['${tag}'].data`, []);
  }), '_id');
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
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOAD_TAG:
      return state;
    case LOAD_TAG_SUCCESS:
      return (() => {
        const inputTagsInfo = {
          ...state.inputTagsInfo,
          [action.result.name]: {
            // loading: false,
            // loaded: true,
            data: action.result.resources,
            error: null
          }
        };
        return {
          ...state,
          inputTagsInfo,
          resources: getResources(state, {inputTagsInfo})
        };
      })();
    case LOAD_TAG_FAIL:
      return {
        ...state,
        inputTagsInfo: {
          ...state.inputTagsInfo,
          [action.error.tag]: {
            // loading: false,
            // loaded: false,
            error: action.error
          }
        }
      };
    case ADD_TAG:
      return (() => {
        const inputTags = [...state.inputTags, action.tag.text];
        return {
          ...state,
          inputTags: inputTags,
          resources: getResources(state, {inputTags})
        };
      })();
    case REMOVE_TAG:
      return (() => {
        const index = findIndex(state.inputTags, { text: action.tag.text });
        if (index === -1) return state;
        const inputTags = update(state.inputTags, {
          $splice: [[index, 1]]
        });
        return {
          ...state,
          inputTags: inputTags,
          resources: getResources(state, {inputTags}),
        };
      })();
    case CHANGE_TAGS:
      return {
        ...state,
        inputTags: action.tags,
        resources: getResources(state, { inputTags: action.tags })
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.tags && globalState.tags.loaded;
}

export function isTagLoaded(inputTagsInfo, tag) {
  return inputTagsInfo[tag] && inputTagsInfo[tag].data;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadTags')
  };
}

export function loadTag(tag) {
  return {
    types: [LOAD_TAG, LOAD_TAG_SUCCESS, LOAD_TAG_FAIL],
    promise: (client) => client.get('/loadTags', { params: { tag } })
  };
}

export function addTag(text) {
  return {
    type: ADD_TAG,
    tag: { text }
  };
}

export function removeTag(text) {
  return {
    type: REMOVE_TAG,
    tag: { text }
  };
}

export function changeTags(tags) {
  return {
    type: CHANGE_TAGS,
    tags: tags
  };
}
