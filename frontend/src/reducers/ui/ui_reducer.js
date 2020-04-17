import { combineReducers } from 'redux';
import modalReducer from './modal_reducer';
import loadingReducer from "./loading_reducer";
import mediaTypeReducer from "./mediaType_reducer";

const uiReducer = combineReducers({
  modal: modalReducer,
  loading: loadingReducer,
  mediaType: mediaTypeReducer
});

export default uiReducer;