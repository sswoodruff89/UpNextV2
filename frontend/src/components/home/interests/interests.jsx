import React from 'react';
import { connect } from 'react-redux';
import SimpleSlider from '../slider/simple_slider';
import { fetchInterests } from '../../../actions/interest_actions';
import { updateGenre, updateGenres } from '../../../actions/genre_actions';
import {startLoadingAll, endLoadingAll} from "../../../actions/recommendation_actions";
import * as TMDBAPIUtil from '../../../util/tmdb_api_util';
import { createAllRecommendations, deleteAllRecommendations } from '../../../actions/recommendation_actions';

const isEmpty = require("lodash.isempty");

class Interests extends React.Component {
  componentDidMount() {

    this.props.fetchInterests(this.props.mediaType);
  }

  componentDidUpdate(prevProps) {
    // can check if interests have changed
    ///////
    //Store recommendations to shorten runtime?
    ///
    ////
    // console.log(prevProps.genres);
    // console.log(this.props.genres);
    // console.log(prevProps.interests);
    // console.log(this.props.interests);
    // debugger
    if (JSON.stringify(prevProps.genres) !== JSON.stringify(this.props.genres)) {
    // if (Object.keys(prevProps.interests).length !== Object.keys(this.props.interests).length) {
      const { genres, interests, mediaType } = this.props;
      // Object.values(genres).forEach(genre => {
      //   this.props.updateGenre(genres[genre.name]._id, {
      //     value: 0,
      //     mediaType
      //   });
      // });

      this.props.updateGenres("genreIds", {mediaType});


      // Object.values(genres).forEach(genre => {
      //   this.props.updateGenre(genres[genre.name]._id, { value: 0 });
      // });
      // { value: 1, interestCount: Object.keys(mediaIds).length, mediaType}
    // without checking if the previous genres were not empty, we see a split second of the default API call where
      // genreIds is an empty arr and TMDB returns a default results response, because initially the genres slice of
      // state is empty
    }
    
    if (JSON.stringify(prevProps.genres) !== JSON.stringify(this.props.genres) && !isEmpty(this.props.genres) && !isEmpty(this.props.interests)) {
      // filter genre slice of state to get superlike genre array
      // call getAllRecommendations'
      let mixLikeArr = [];
      // Only set superLikeArr if we have at least 3 superLiked-tier genres
      let checkSuperLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "superLike").map(el => el.id);
      let checkLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "like").map(el => el.id);
      if (checkSuperLikeArr.length >= 3) mixLikeArr = checkSuperLikeArr;
      
      this.props.startLoadingAll();


      let recommendations = [];
      let mediaIdTrack = new Set();
      let totalExpected = 50;
      let promiseAExpected = 15;
      let promiseBExpected = 15;
      let promiseCExpected = 10;
      let promiseDExpected = 10;
      // Pull out random 3 superLiked-tier genres, joined by AND

      console.time("allRec");
      console.log(".................................");


      const type = (this.props.mediaType === "movie") ? "Movie" : "TV"
      TMDBAPIUtil.getAllRecommendations(mixLikeArr)
        .then(response => {
          const promisesA = [];
          for (let i=0; i < Math.min(response.data.results.length,promiseAExpected); i++) {
            let recommendation = response.data.results[i];
            let recId = recommendation.id;
            promisesA.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
              .then(media => {
                if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                  recommendation.genres = media.data.genres;
                  recommendation.runtime = media.data.runtime;
                  recommendation.type = this.props.mediaType;
                  recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                  if (type === "Movie") {
                    recommendation.runtime = media.data.runtime;
                  } else {
                    recommendation.seasons = media.data.seasons;
                  }
                  recommendations.push(recommendation);
                }
              })
            );
          }

          Promise.all(promisesA)
            .then(() => {
              if (!this.loadingTimeout) {
                this.loadingTimeout = setTimeout(() => {
                  this.props.endLoadingAll();
                }, 700);
              } else {
                clearTimeout(this.loadingTimeout);
                this.loadingTimeout = setTimeout(() => {
                  this.props.endLoadingAll();
                }, 700);
              }

              if ( checkSuperLikeArr.length >= 2 ) {
                mixLikeArr = checkSuperLikeArr;
              // } else if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
              //   let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length-1));
              //   let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length-1));
              //   mixLikeArr = [].push(checkSuperLikeArr[randSuperLikeIndex],checkLikeArr[randLikeIndex]);
              } else {
                mixLikeArr = [];
              }
              // Pull out random 2 liked-tier genres, joined by OR
              TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                .then(response => {
                  const promisesB = [];
                  
                  if (recommendations.length < promiseAExpected) promiseBExpected = promiseBExpected + (promiseAExpected - recommendations.length);
                  promiseBExpected = Math.min(20, promiseBExpected);
                  for (let i=0; i < Math.min(response.data.results.length,promiseBExpected); i++) {
                    let recommendation = response.data.results[i];
                    let recId = recommendation.id;
                    if (!mediaIdTrack.has(recId)) {
                      promisesB.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                        .then(media => {
                          if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                            recommendation.genres = media.data.genres;
                            recommendation.runtime = media.data.runtime;
                            recommendation.type = this.props.mediaType;
                            recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                            if (type === "Movie") {
                              recommendation.runtime = media.data.runtime;
                            } else {
                              recommendation.seasons = media.data.seasons;
                            }
                            recommendations.push(recommendation);
                          }
                        })
                      );
                    }
                  }
                  Promise.all(promisesB)
                    .then(() => {
                      if (!this.loadingTimeout) {
                        this.loadingTimeout = setTimeout(() => {
                          this.props.endLoadingAll();
                        }, 700);
                      } else {
                        clearTimeout(this.loadingTimeout);
                        this.loadingTimeout = setTimeout(() => {
                          this.props.endLoadingAll();
                        }, 700);
                      }

                      if (checkLikeArr.length >= 1 && checkSuperLikeArr.length >= 1) {
                        let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length-1));
                        let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length-1));
                        mixLikeArr = [];
                        mixLikeArr.push(checkSuperLikeArr[randSuperLikeIndex],checkLikeArr[randLikeIndex]);
                      } else {
                        mixLikeArr = [];
                      }
                      // Pull out random 2 liked-tier genres, joined by OR
                      TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                        .then(response => {
                          const promisesC = [];

                          if (recommendations.length < promiseBExpected) promiseCExpected = promiseCExpected + (promiseBExpected - recommendations.length);
                          promiseCExpected = Math.min(20, promiseCExpected);
                          for (let i=0; i < Math.min(response.data.results.length,promiseCExpected); i++) {
                            let recommendation = response.data.results[i];
                            let recId = recommendation.id;
                            if (!mediaIdTrack.has(recId)) {
                              promisesC.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                .then(media => {
                                  if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                    recommendation.genres = media.data.genres;
                                    recommendation.runtime = media.data.runtime;
                                    recommendation.type = this.props.mediaType;
                                    recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                    if (type === "Movie") {
                                      recommendation.runtime = media.data.runtime;
                                    } else {
                                      recommendation.seasons = media.data.seasons;
                                    }
                                    recommendations.push(recommendation);
                                  }
                                })
                              );
                            }
                          }

                          Promise.all(promisesC)
                            .then(() => {
                              // check if there are at least two like-tier genres
                              if (checkLikeArr.length >= 2) {
                                mixLikeArr = checkLikeArr;
                              } else {
                                mixLikeArr = [];
                              }
                              // Pull out random 2 liked-tier genres, joined by AND
                              TMDBAPIUtil.getAllRecommendations(mixLikeArr, 2, "%2C")
                                .then(response => {
                                  const promisesD = [];

                                  if (recommendations.length < promiseCExpected) promiseDExpected = promiseDExpected + (promiseCExpected - recommendations.length);
                                  promiseDExpected = Math.min(20, promiseDExpected);
                                  for (let i=0; i < Math.min(response.data.results.length,promiseDExpected); i++) {
                                    let recommendation = response.data.results[i];
                                    let recId = recommendation.id;
                                    if (!mediaIdTrack.has(recId)) {
                                      promisesD.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                        .then(media => {
                                          if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                            recommendation.genres = media.data.genres;
                                            recommendation.runtime = media.data.runtime;
                                            recommendation.type = this.props.mediaType;
                                            recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                            if (type === "Movie") {
                                              recommendation.runtime = media.data.runtime;
                                            } else {
                                              recommendation.seasons = media.data.seasons;
                                            }
                                            recommendations.push(recommendation);
                                          }
                                        })
                                      );
                                    }
                                  }

                                  Promise.all(promisesD)
                                    .then(() => {
                                      // check if there are at least two like-tier genres
                                        mixLikeArr = checkLikeArr.concat(checkSuperLikeArr);
                                      // Pull out random 2 liked-tier genres, joined by AND
                                      let remainder = Math.max(0,totalExpected - recommendations.length);
                                      remainder = Math.min(20,remainder);
                                      TMDBAPIUtil.getAllRecommendations(mixLikeArr, mixLikeArr.length, "%7C")
                                        .then(response => {
                                          const promisesE = [];
                                          
                                          for (let i=0; i < Math.min(response.data.results.length,remainder); i++) {
                                            let recommendation = response.data.results[i];
                                            let recId = recommendation.id;
                                            if (!mediaIdTrack.has(recId)) {
                                              promisesE.push(TMDBAPIUtil.getMediaInfo(recId, this.props.mediaType)
                                                .then(media => {
                                                  if (!this.props.interests[media.data.id] && TMDBAPIUtil[`hasValid${type}Fields`](media.data)) {
                                                    recommendation.genres = media.data.genres;
                                                    recommendation.runtime = media.data.runtime;
                                                    recommendation.type = this.props.mediaType;
                                                    recommendation.overview = recommendation.overview === "" ? "N/A" : recommendation.overview;
                                                    if (type === "Movie") {
                                                      recommendation.runtime = media.data.runtime;
                                                    } else {
                                                      recommendation.seasons = media.data.seasons;
                                                    }
                                                    recommendations.push(recommendation);
                                                  }
                                                })
                                              );
                                            }
                                          }

                                          Promise.all(promisesE)
                                            .then(() => {
                                              if (!this.loadingTimeout) {
                                                this.loadingTimeout = setTimeout(() => {
                                                  this.props.endLoadingAll();
                                                }, 700);
                                              } else {
                                                clearTimeout(this.loadingTimeout);
                                                this.loadingTimeout = setTimeout(() => {
                                                  this.props.endLoadingAll();
                                                }, 700);
                                              }
                                              this.props.createAllRecommendations(recommendations);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    if (isEmpty(this.props.interests)) {
      if (!this.loadingTimeout) {
        this.loadingTimeout = setTimeout(() => {
          this.props.endLoadingAll();
        }, 700);
      } else {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => {
          this.props.endLoadingAll();
        }, 700);
      }
      this.props.deleteAllRecommendations();
    }
  }

  

  genresChanged(prevGenres, currentGenres) {
    let prevValues = Object.values(prevGenres);
    let currentValues = Object.values(currentGenres);

    if (prevValues.length !== currentValues.length) return true;

    for(let i=0; i < currentValues.length; i++) {
      if (currentValues[i].tier !== prevValues[i].tier) {
        return true;
      }
    }

    return false;
  };

  render() {
    const {mediaType, interests} = this.props;
    let banner = mediaType[0].toUpperCase() + mediaType.slice(1);

    return (
      <div className="interests-container">
        <header className='slider-header'>
          <div className='slider-title'>
            Your {banner} Interests
          </div>
        </header>
        <SimpleSlider 
          items={interests} 
            type={'interests'}
              mediaType={mediaType} />
      </div>
    );
  }
}

const msp = (state, ownProps) => {
  let mediaType = state.ui.mediaType;
  return {
    interests: state.entities.interests[`${mediaType.toLowerCase()}s`],
    genres: state.entities.genres,
    mediaType
  }
};

const mdp = dispatch => ({
  fetchInterests: (type) => dispatch(fetchInterests(type)),
  updateGenre: (genreId,value) => dispatch(updateGenre(genreId,value)),
  updateGenres: (genreIds, value) => dispatch(updateGenres(genreIds, value)),
  createAllRecommendations: data => dispatch(createAllRecommendations(data)),
  deleteAllRecommendations: () => dispatch(deleteAllRecommendations()),
  startLoadingAll: () => dispatch(startLoadingAll()),
  endLoadingAll: () => dispatch(endLoadingAll())
});

export default connect(msp, mdp)(Interests);