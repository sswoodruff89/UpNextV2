import * as RecommendationAPIUtil from '../util/recommendations_api_util';

export const RECEIVE_RECOMMENDATIONS = "RECEIVE_RECOMMENDATIONS";
export const RECEIVE_SIMILAR_RECOMMENDATIONS = "RECEIVE_SIMILAR_RECOMMENDATIONS";
export const RECEIVE_ALL_RECOMMENDATIONS = "RECEIVE_ALL_RECOMMENDATIONS";
export const START_LOADING_SIMILAR_RECOMMENDATIONS = "START_LOADING_SIMILAR_RECOMMENDATIONS";
export const START_LOADING_ALL_RECOMMENDATIONS = "START_LOADING_ALL_RECOMMENDATIONS";
export const END_LOADING_ALL_RECOMMENDATIONS = "END_LOADING_ALL_RECOMMENDATIONS";

let ALL_RECOMMENDATIONS_RECEIVED = false;

export const allRecsReceived = () => {
  if (!ALL_RECOMMENDATIONS_RECEIVED) {
    ALL_RECOMMENDATIONS_RECEIVED = true;

    const allRecTimeout = setTimeout(() => {
      ALL_RECOMMENDATIONS_RECEIVED = false
    }, 2000)
  }
}


///////FOR LOADING

export const startLoadingSimilar = () => {
  return {
    type: START_LOADING_SIMILAR_RECOMMENDATIONS
  };
};

export const startLoadingAll = () => {
  return {
    type: START_LOADING_ALL_RECOMMENDATIONS
  };
};

export const endLoadingAll = () => {
  return {
    type: END_LOADING_ALL_RECOMMENDATIONS
  };
}

///////

export const receiveRecommendations = recommendations => ({
  type: RECEIVE_RECOMMENDATIONS,
  recommendations
});

export const receiveSimilarRecommendations = recommendations => ({
  type: RECEIVE_SIMILAR_RECOMMENDATIONS,
  recommendations
});

export const receiveAllRecommendations = recommendations => ({
  type: RECEIVE_ALL_RECOMMENDATIONS,
  recommendations
});

export const createSimilarRecommendations = data => dispatch => {
  dispatch(startLoadingSimilar());

  RecommendationAPIUtil.createSimilarRecommendations(data).then(res => {
    dispatch(receiveSimilarRecommendations(res.data));
  });
};

export const createAllRecommendations = data => dispatch => {
  // dispatch(startLoadingAll());
  // setTimeout(() => {
  //   dispatch(endLoadingAll());
  // }, 1500);
  
  return RecommendationAPIUtil.createAllRecommendations(data).then(res => {
    // if (!ALL_RECOMMENDATIONS_RECEIVED) {
      dispatch(receiveAllRecommendations(res.data));
      allRecsReceived();
    // }
  });
};

export const fetchSimilarRecommendations = mediaType => dispatch => {
  dispatch(startLoadingSimilar());

  RecommendationAPIUtil.fetchSimilarRecommendations(mediaType).then(res => {
    dispatch(receiveSimilarRecommendations(res.data));
  });
};

///MAY NOT NEED THIS////
export const fetchAllRecommendations = (mediaType) => dispatch => {
  dispatch(startLoadingAll());


  RecommendationAPIUtil.fetchAllRecommendations(mediaType).then(res => {
    dispatch(receiveAllRecommendations(res.data));
  });
};

export const deleteSimilarRecommendations = () => dispatch => {
  return RecommendationAPIUtil.deleteSimilarRecommendations().then(res => {
    dispatch(receiveSimilarRecommendations(res.data));
  });}

export const deleteAllRecommendations = () => dispatch => {
  return RecommendationAPIUtil.deleteAllRecommendations().then(res => {
    dispatch(receiveAllRecommendations(res.data));
  });
};
