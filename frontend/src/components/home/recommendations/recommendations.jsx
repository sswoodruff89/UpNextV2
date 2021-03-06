import React from 'react';
import { connect } from 'react-redux';
import SimpleSlider from '../slider/simple_slider';
import { fetchGenres } from '../../../actions/genre_actions';
import { fetchInterests } from '../../../actions/interest_actions';
import * as TMDBAPIUtil from '../../../util/tmdb_api_util';
import { startLoadingAll, endLoadingAll } from "../../../actions/recommendation_actions";

import Loading from "../loading/loading";
import { fetchSimilarRecommendations, fetchAllRecommendations, createAllRecommendations, deleteAllRecommendations } from '../../../actions/recommendation_actions';

class Recommendations extends React.Component {
  componentDidMount() {
    // TODO: this shouldn't be here, fetchGenres() shouldn't be here either
    // this.props.fetchInterests();
    if (this.props.type === "similar") {
      this.props.fetchSimilarRecommendations(this.props.mediaType);
    } else {
      // this.props.fetchAllRecommendations(this.props.mediaType);
      this.props.deleteAllRecommendations();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mediaType !== this.props.mediaType) {
      if (this.props.type === "similar") {
        this.props.fetchSimilarRecommendations(this.props.mediaType);
      } else {
        // this.props.fetchAllRecommendations(this.props.mediaType);
        this.props.deleteAllRecommendations()
          .then(response => {

            let mixLikeArr = [];
            // Only set superLikeArr if we have at least 3 superLiked-tier genres
            let checkSuperLikeArr = [];
            let checkLikeArr = [];

            Object.values(this.props.genres).forEach(genre => {
              if (genre[`${this.props.mediaType}Tier`] === 'superLike') {
                checkSuperLikeArr.push(genre.id);
              } else if (genre[`${this.props.mediaType}Tier`] === 'like') {
                checkLikeArr.push(genre.id);
              }
            });
            // .filter(ele => ele[`${this.props.mediaType}Tier`] === "superLike").map(el => el.id);
            // let checkLikeArr = Object.values(this.props.genres).filter(ele => ele[`${this.props.mediaType}Tier`] === "like").map(el => el.id);
            if (checkSuperLikeArr.length >= 3) mixLikeArr = checkSuperLikeArr;

            let recommendations = [];
            let mediaIdTrack = new Set();
            let totalExpected = 50;
            let promiseAExpected = 15;
            let promiseBExpected = 15;
            let promiseCExpected = 10;
            let promiseDExpected = 10;
            const type = (this.props.mediaType === "movie") ? "Movie" : "TV"

            TMDBAPIUtil.getAllRecommendations(mixLikeArr, this.props.mediaType)
              .then(response => {
                const promisesA = [];
                for (let i = 0; i < Math.min(response.data.results.length, promiseAExpected); i++) {
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
                          recommendation.seasons = media.data.number_of_seasons;
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

                    if (checkSuperLikeArr.length >= 2) {
                      mixLikeArr = checkSuperLikeArr;
                    } else {
                      mixLikeArr = [];
                    }
                    // Pull out random 2 liked-tier genres, joined by OR
                    
                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, this.props.mediaType, 2, "%2C")
                      .then(response => {
                        const promisesB = [];

                        if (recommendations.length < promiseAExpected) promiseBExpected = promiseBExpected + (promiseAExpected - recommendations.length);
                        promiseBExpected = Math.min(20, promiseBExpected);
                        for (let i = 0; i < Math.min(response.data.results.length, promiseBExpected); i++) {
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
                                    recommendation.seasons = media.data.number_of_seasons;
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
                              let randSuperLikeIndex = Math.floor(Math.random() * (checkSuperLikeArr.length - 1));
                              let randLikeIndex = Math.floor(Math.random() * (checkLikeArr.length - 1));
                              mixLikeArr = [];
                              mixLikeArr.push(checkSuperLikeArr[randSuperLikeIndex], checkLikeArr[randLikeIndex]);
                            } else {
                              mixLikeArr = [];
                            }
                            // Pull out random 2 liked-tier genres, joined by OR
                            TMDBAPIUtil.getAllRecommendations(mixLikeArr, this.props.mediaType, 2, "%2C")
                              .then(response => {
                                const promisesC = [];

                                if (recommendations.length < promiseBExpected) promiseCExpected = promiseCExpected + (promiseBExpected - recommendations.length);
                                promiseCExpected = Math.min(20, promiseCExpected);
                                for (let i = 0; i < Math.min(response.data.results.length, promiseCExpected); i++) {
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
                                            recommendation.seasons = media.data.number_of_seasons;
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
                                    TMDBAPIUtil.getAllRecommendations(mixLikeArr, this.props.mediaType, 2, "%2C")
                                      .then(response => {
                                        const promisesD = [];

                                        if (recommendations.length < promiseCExpected) promiseDExpected = promiseDExpected + (promiseCExpected - recommendations.length);
                                        promiseDExpected = Math.min(20, promiseDExpected);
                                        for (let i = 0; i < Math.min(response.data.results.length, promiseDExpected); i++) {
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
                                                    recommendation.seasons = media.data.number_of_seasons;
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
                                            let remainder = Math.max(0, totalExpected - recommendations.length);
                                            remainder = Math.min(20, remainder);
                                            TMDBAPIUtil.getAllRecommendations(mixLikeArr, this.props.mediaType, mixLikeArr.length, "%7C")
                                              .then(response => {
                                                const promisesE = [];

                                                for (let i = 0; i < Math.min(response.data.results.length, remainder); i++) {
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
                                                            recommendation.seasons = media.data.number_of_seasons;
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
          })
      }
    }
  }

  render() {
    const { mediaType, lastViewedInterest, type, loading } = this.props;

    let lastViewedInterestTitle = "";
    let sliderTitle;
    let recommendations;

    if (lastViewedInterest) {
      lastViewedInterestTitle = lastViewedInterest.title;
    }

    if (type === "similar") {
      sliderTitle = `Because you watched ${lastViewedInterestTitle}`;
      recommendations = this.props.recommendations.similar;
    } else {
      sliderTitle = `Because you're you!`;
      recommendations = this.props.recommendations.all;
    };

    /////LOADING////// 
    if (loading[`${type}Loading`]) {
      return (
        <div className="recommendations-container">
          <section className="recommendations-similar">
            <header className="slider-header">
              <div className="slider-title">{sliderTitle}</div>
            </header>
            <Loading />
          </section>
        </div>
      );
    }
    ////////////
    
    return (
      <div className="recommendations-container">
        <section className="recommendations-similar">
          <header className="slider-header">
            <div className="slider-title">{sliderTitle}</div>
          </header>
          <SimpleSlider
            mediaType={mediaType}
            items={recommendations}
            type={"recommendations"}
            recType={type}
          />
        </section>
      </div>
    );
  }
}

const msp = (state, ownProps) => {
  let mediaType = state.ui.mediaType;

  return {
    recommendations: state.entities.recommendations,
    lastViewedInterest: Object.values(state.entities.interests[`${mediaType}s`]).sort((a,b) => {
      if(a.date > b.date) {
        return -1;
      } else if (a.date < b.date){
        return 1;
      }
      return 0;
    }).shift(),
    loading: state.ui.loading,
    genres: state.entities.genres,
    interests: state.entities.interests[`${mediaType}s`],

    mediaType
  }
};

const mdp = dispatch => ({
  fetchGenres: () => dispatch(fetchGenres()),
  fetchSimilarRecommendations: (mediaType) => dispatch(fetchSimilarRecommendations(mediaType)),
  fetchAllRecommendations: (mediaType) => dispatch(fetchAllRecommendations(mediaType)),
  deleteAllRecommendations: () => dispatch(deleteAllRecommendations()),
  fetchInterests: () => dispatch(fetchInterests()),
  startLoadingAll: () => dispatch(startLoadingAll()),
  endLoadingAll: () => dispatch(endLoadingAll()),
  createAllRecommendations: data => dispatch(createAllRecommendations(data)),

});

export default connect(msp, mdp)(Recommendations);
