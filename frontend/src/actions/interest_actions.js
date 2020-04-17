import * as InterestApiUtil from '../util/interest_api_util';
import {startLoadingAll, endLoadingAll} from "./recommendation_actions";

export const RECEIVE_INTERESTS = "RECEIVE_INTERESTS";
export const RECEIVE_MOVIE_INTERESTS = "RECEIVE_MOVIE_INTERESTS";
export const RECEIVE_TV_INTERESTS = "RECEIVE_TV_INTERESTS";
export const RECEIVE_NEW_INTEREST = "RECEIVE_NEW_INTEREST";
export const REMOVE_INTEREST = "REMOVE_INTEREST";


export const receiveInterests = (interests, mediaType) => ({
  type: RECEIVE_INTERESTS,
  interests,
  mediaType
});


export const receiveNewInterest = (interest, mediaType) => ({
  type: RECEIVE_NEW_INTEREST,
  interest,
  mediaType
});

export const removeInterest = (interestId, mediaType) => ({
  type: REMOVE_INTEREST,
  interestId,
  mediaType
});

export const fetchInterests = (mediaType) => dispatch => (
  InterestApiUtil.getInterests()
    .then(interests => dispatch(receiveInterests(interests, mediaType)))
    .catch(err => console.log(err))  
);

export const createInterest = (data, mediaType) => dispatch => {
  // dispatch(startLoadingAll());
  // setTimeout(() => {
  //   dispatch(endLoadingAll());
  // }, 1500);

  return InterestApiUtil.addInterest(data)
  .then(interest => dispatch(receiveNewInterest(interest, mediaType)))
  .catch(err => console.log(err))  
}
 

export const deleteInterest = (interestId, mediaType) => dispatch => {
  // dispatch(startLoadingAll());
  // setTimeout(() => {
  //   dispatch(endLoadingAll());
  // }, 3000);

  return InterestApiUtil.deleteInterest(interestId)
    .then(response => dispatch(removeInterest(response.data.id)))
    .catch(err => console.log(err));
}

