import {
  RECEIVE_INTERESTS,
  RECEIVE_MOVIE_INTERESTS,
  RECEIVE_TV_INTERESTS,
  RECEIVE_NEW_INTEREST,
  REMOVE_INTEREST,
} from "../../actions/interest_actions";
import { RECEIVE_USER_LOGOUT } from '../../actions/session_actions';

const _initialState = {
  movies: {},
  tvshows: {}
}

const InterestsReducer = (state = _initialState, action) => {
  Object.freeze(state);
  let newState = Object.assign({}, state);
  
  switch(action.type) {
    case RECEIVE_INTERESTS:
      
      action.interests.data.forEach((interest, idx) => {
        newState[`${action.interests.data[idx].type}s`][
          action.interests.data[idx].mediaId
        ] = interest;
      });
      return newState;

    case RECEIVE_NEW_INTEREST:
      newState[`${action.interest.data.type}s`][
        action.interest.data.mediaId
      ] = action.interest.data;
      
      return newState;
    case REMOVE_INTEREST:
      // newState = action.interest.data;
      delete newState[`${action.mediaType}s`][action.interestId];
      return newState;
    case RECEIVE_USER_LOGOUT:
      return {};
    default:
      return state;
  }
};
export default InterestsReducer;