import React from 'react';
import { connect } from 'react-redux';
import SimpleSlider from '../slider/simple_slider';
import { fetchInterests } from '../../../actions/interest_actions';
import { updateGenre } from '../../../actions/genre_actions';
import * as TMDBAPIUtil from '../../../util/tmdb_api_util';
import { createAllRecommendations, deleteAllRecommendations } from '../../../actions/recommendation_actions';

const isEmpty = require("lodash.isempty");

class Interests extends React.Component {
  componentDidMount() {
    this.props.fetchInterests();
  }

  componentDidUpdate(prevProps) {
    // can check if interests have changed
    if (Object.keys(prevProps.interests).length !== Object.keys(this.props.interests).length) {
      const { genres, interests } = this.props;
      Object.values(genres).forEach(genre => {
        this.props.updateGenre(genres[genre.name]._id, { value: 0 });
      });
    // without checking if the previous genres were not empty, we see a split second of the default API call where
      // genreIds is an empty arr and TMDB returns a default results response, because initially the genres slice of
      // state is empty
    }
    
    if (this.genresChanged(prevProps.genres, this.props.genres) && !isEmpty(this.props.genres) && !isEmpty(this.props.interests)) {
      // filter genre slice of state to get superlike genre array
      // call getAllRecommendations
      let mixLikeArr = [];
      // Only set superLikeArr if we have at least 3 superLiked-tier genres
      let checkSuperLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "superLike").map(el => el.id);
      let checkLikeArr = Object.values(this.props.genres).filter(ele => ele.tier === "like").map(el => el.id);
      if (checkSuperLikeArr.length >= 3) mixLikeArr = checkSuperLikeArr;
      
      let recommendations = [];
      let movieIdTrack = new Set();
      // Pull out random 3 superLiked-tier genres, joined by AND
      TMDBAPIUtil.getAllRecommendations(mixLikeArr)
        .then(response => {
          const promisesA = [];
          for (let i=0; i < Math.min(response.data.results.length,15); i++) {
            let recommendation = response.data.results[i];
            let recId = recommendation.id;
            promisesA.push(TMDBAPIUtil.getMovieInfo(recId)
              .then(movie => {
                if (!this.props.interests[movie.data.id]) {
                  recommendation.genres = movie.data.genres;
                  recommendation.runtime = movie.data.runtime;
                  recommendations.push(recommendation);
                }
              })
            );
          }

          Promise.all(promisesA)
            .then(() => {
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
                  for (let i=0; i < Math.min(response.data.results.length,10); i++) {
                    let recommendation = response.data.results[i];
                    let recId = recommendation.id;
                    if (!movieIdTrack.has(recId)) {
                      promisesB.push(TMDBAPIUtil.getMovieInfo(recId)
                        .then(movie => {
                          if (!this.props.interests[movie.data.id]) {
                            recommendation.genres = movie.data.genres;
                            recommendation.runtime = movie.data.runtime;
                            recommendations.push(recommendation);
                          }
                        })
                      );
                    }
                  }

                  Promise.all(promisesB)
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
                          for (let i=0; i < Math.min(response.data.results.length,10); i++) {
                            let recommendation = response.data.results[i];
                            let recId = recommendation.id;
                            if (!movieIdTrack.has(recId)) {
                              promisesD.push(TMDBAPIUtil.getMovieInfo(recId)
                                .then(movie => {
                                  if (!this.props.interests[movie.data.id]) {
                                    recommendation.genres = movie.data.genres;
                                    recommendation.runtime = movie.data.runtime;
                                    recommendations.push(recommendation);
                                  }
                                })
                              );
                            }
                          }
                          Promise.all(promisesD)
                            .then(() => {
                              this.props.createAllRecommendations(recommendations);
                            });
                        });
                    });
                });
            });
        });
    }

    if (isEmpty(this.props.interests)) {
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
  }

  render() {
    return (
      <div className="interests-container">
        <header className='slider-header'>
          <div className='slider-title'>
            Your Interests
          </div>
        </header>
        <SimpleSlider items={this.props.interests} type={'interests'}/>
      </div>
    );
  }
}

const msp = state => ({
  interests: state.entities.interests,
  genres: state.entities.genres
});

const mdp = dispatch => ({
  fetchInterests: () => dispatch(fetchInterests()),
  updateGenre: (genreId,value) => dispatch(updateGenre(genreId,value)),
  createAllRecommendations: data => dispatch(createAllRecommendations(data)),
  deleteAllRecommendations: () => dispatch(deleteAllRecommendations())
});

export default connect(msp, mdp)(Interests);