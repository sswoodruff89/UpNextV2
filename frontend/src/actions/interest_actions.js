import * as InterestApiUtil from '../util/interest_api_util';
import {startLoadingAll, endLoadingAll} from "./recommendation_actions";

export const RECEIVE_INTERESTS = "RECEIVE_INTERESTS";
export const RECEIVE_MOVIE_INTERESTS = "RECEIVE_MOVIE_INTERESTS";
export const RECEIVE_TV_INTERESTS = "RECEIVE_TV_INTERESTS";
export const RECEIVE_NEW_INTEREST = "RECEIVE_NEW_INTEREST";
export const REMOVE_INTEREST = "REMOVE_INTEREST";


export const receiveInterests = (interests) => ({
  type: RECEIVE_INTERESTS,
  interests
});


export const receiveNewInterest = (interest) => ({
  type: RECEIVE_NEW_INTEREST,
  interest
});

export const removeInterest = (payload) => ({
  type: REMOVE_INTEREST,
  payload
});

export const fetchInterests = (type) => dispatch => (
  InterestApiUtil.getInterests(type)
    .then(interests => dispatch(receiveInterests(interests)))
    .catch(err => console.log(err))  
);

export const createInterest = (data) => dispatch => {
  // dispatch(startLoadingAll());
  // setTimeout(() => {
  //   dispatch(endLoadingAll());
  // }, 1500);

  return InterestApiUtil.addInterest(data)
  .then(interest => dispatch(receiveNewInterest(interest)))
  .catch(err => console.log(err))  
}
 

export const deleteInterest = (data) => dispatch => {
  // dispatch(startLoadingAll());
  // setTimeout(() => {
  //   dispatch(endLoadingAll());
  // }, 3000);

  return InterestApiUtil.deleteInterest(data)
    .then(response => {
      return dispatch(removeInterest(response.data))
    })
    .catch(err => console.log(err));
}

