import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import keys from "../../config/keys";
import { createInterest, deleteInterest } from "../../actions/interest_actions";
import { fetchSimilarRecommendations, createSimilarRecommendations, createAllRecommendations } from '../../actions/recommendation_actions';
import { createGenre, updateGenre } from '../../actions/genre_actions';
import * as TMDBAPIUtil from '../../util/tmdb_api_util';
import genreSplit from '../../util/genre_split_util';


const tmdbApiKey = keys.tmdbApiKey;
const isEmpty = require("lodash.isempty");


class Details extends React.Component {
  constructor(props) {
    super(props);

    this.addInterest = this.addInterest.bind(this);
    this.removeFromInterests = this.removeFromInterests.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleRuntime = this.handleRuntime.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.months = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  }

  handleClose(e) {
    e.preventDefault();
    this.props.closeModal();
  }

  addInterest(e) {
    e.preventDefault();
    // let id = this.props.detailsItem.movieId;
    const { updateGenre, createGenre, genres, detailsItem, mediaType } = this.props;

    let id = detailsItem.mediaId;
    detailsItem.id = detailsItem.mediaId;
    detailsItem.poster_path = detailsItem.poster;
    detailsItem.vote_average = detailsItem.voteAverage;
    detailsItem.vote_count = detailsItem.voteCount;
    detailsItem.type = mediaType;
    const newGenres = [];

    detailsItem.genres.forEach(genre => {
      if (genreSplit[genre.name]) {
        newGenres.push(...genreSplit[genre.name]);
      } else {
        newGenres.push(genre);
      }
    })
    
    
    detailsItem.genres = newGenres;
    if (mediaType === "movie") {
      detailsItem.release_date = detailsItem.year;
    } else {
      detailsItem.number_of_seasons = detailsItem.seasons;
      detailsItem.first_air_date = detailsItem.year;
      detailsItem.name = detailsItem.title;
    }

    detailsItem.release_date = (mediaType === "movie") ? detailsItem.release_date : detailsItem.first_air_date;
    // this.props.detailsItem.seasons = this.

    Promise.all([this.props.createInterest(detailsItem)]).then(() => {
      // genres calculation

      detailsItem.genres.forEach(genre => {
        if (genres[genre.name]) {
          updateGenre(genres[genre.name]._id, { value: 1, mediaType });
        } else {
          createGenre({ genre, mediaType });
        }
      });
    });
// 
    // May refactor in the future so that recommendations are made only after and if createInterest and closeModal are successful
    TMDBAPIUtil.getSimilarRecommendations(id, mediaType)
      .then(response => {
        let count = 0;
        let recommendations = [];
        // let type = this.props.mediaType[0].toUpperCase() + this.props.mediaType.slice(1);

        if (this.props.mediaType === "movie") {
          const promises = response.data.results.map((recommendation) => {
            let recId = recommendation.id;
            return TMDBAPIUtil.getMovieInfo(recId)
              .then(media => {
                if (!this.props.mediaIds[media.data.id]) {
                  count += 1;
                  recommendation.genres = media.data.genres;
                  recommendation.runtime = media.data.runtime;
                  recommendation.poster_path = media.data.poster_path;
                  recommendation.type = 'movie';
                  ////REVISE
                  recommendation[`similarMediaId`] = id;

                  recommendations.push(recommendation);
                  if (count === 15) this.props.closeModal();
                }
              });
          });

          Promise.all(promises)
            .then(() => {
              this.props.createSimilarRecommendations(recommendations);
              this.props.closeModal();
            });

        } else {
          const promises = response.data.results.map((recommendation) => {
            let recId = recommendation.id;
            return TMDBAPIUtil.getTVInfo(recId)
              .then(media => {
                if (!this.props.mediaIds[media.data.id]) {
                  count += 1;

                  recommendation.genres = media.data.genres;
                  recommendation.runtime = media.data.runtime;
                  recommendation.type = 'tv';
                  ////REVISE
                  recommendation[`similarMediaId`] = id;
                  recommendation.seasons = media.data.number_of_seasons;

                  recommendations.push(recommendation);
                  if (count === 15) this.props.closeModal();
                }
              });
          });

          Promise.all(promises)
            .then(() => {
              this.props.createSimilarRecommendations(recommendations);
              this.props.closeModal();
            });


        }
      });

    // TMDBAPIUtil.getSimilarRecommendations(id).then(response => {
    //   let count = 0;
    //   let recommendations = [];

    //   const promises = response.data.results.map(recommendation => {
    //     let recId = recommendation.id;
    //     return TMDBAPIUtil.getMovieInfo(recId).then(media => {
    //       if (!this.props.mediaIds[media.data.id]) {
    //         count += 1;

    //         recommendation.genres = media.data.genres;
    //         recommendation.runtime = media.data.runtime;

    //         //////REVISE///////
    //         recommendation.similarMovieId = id;

    //         recommendations.push(recommendation);
    //         if (count === 15) this.props.closeModal();
    //       }
    //     });
    //   });

    //   Promise.all(promises).then(() => {
    //     this.props.createSimilarRecommendations(recommendations);
    //     this.props.closeModal();
    //   });
    // });
  }

  removeFromInterests(e) {
    e.preventDefault();

    const localGenres = this.props.detailsItem.genres;
    // Promise.all([this.props.deleteInterest({ this.props.detailsItem._id, this.props.detailsItem.type } )]).then(() => {
    Promise.all([this.props.deleteInterest({type: this.props.mediaType, _id: this.props.detailsItem._id})]).then(() => {
      // genres calculation
      const { genres, detailsItem, mediaType} = this.props;
      localGenres.forEach(name => {
        this.props.updateGenre(genres[name]._id, { value: -1, mediaType });
      });

      this.props.fetchSimilarRecommendations();
      this.props.closeModal();
    });

  }

  handleDate(date) {
    if (!date) return;
    let dateArr = date.split("-");
    return `${dateArr[2]} ${this.months[dateArr[1] - 1]} ${dateArr[0]}`;
  }

  handleRuntime(time) {
    let hour = Math.floor(time / 60);
    let minute = time % 60;

    return (hour === 0) ? `${minute} min` :
           (minute === 0) ? `${hour} hr` :
           (hour > 0 && minute > 0) ? `${hour} hr ${minute} min` :
           "";
  }

  render() {
    const detailsItem = this.props.detailsItem || {};

    if (isEmpty(detailsItem)) {
      return "";
    };

    ///RENDER BUTTONS
    let button = (this.props.detailsType === "recommendations") ? (
      <button className="interest-button" onClick={this.addInterest}>
        Add to Interests
      </button>
    ) : (
      <button className="interest-button" onClick={this.removeFromInterests}>
        Remove from Interests
      </button>
    )
    let genres = [];
  
    if (Object.keys(detailsItem).length !== 0) {
      genres = this.props.detailsType === "recommendations"  ? (
        detailsItem.genres.slice(0,3).map(genre => {
          return genre.name
        })
      ) : (
        detailsItem.genres.slice(0,3).map(id => {
          return this.props.genres[id].name
        })
      );
    }
    // let seasons = (this.props.detailsType === "interests") ? detailsItem.seasons : detailsItem.number_of_seasons;
    return (
      <>
        <div className="close-modal"
          onClick={this.handleClose}>
          <i className="fas fa-times"></i>
        </div>
        <div className="detail-heading">
          <h3 className="detail-title">{detailsItem.title}</h3>
        </div>

        <section className="detail-container">
          <section className="top-half">
            <div className="poster">
              <img
                src={`https://image.tmdb.org/t/p/w500/${detailsItem.poster}`}
                alt="poster"
              />
            </div>

            <div className="runtime-scores">
              <div className="ratings-container">
                <div className="star">
                  <i className="fas fa-star"></i>
                </div>

                <div className="score-votes">
                  <span className="score-num">
                    {detailsItem.voteAverage}
                    <span>/10</span>
                  </span>
                  <span className="vote-count">{`${detailsItem.voteCount} votes`}</span>
                </div>
              </div>

              <span className="year">
                <span>Release Date:</span>
                <span>{this.handleDate(detailsItem.year)}</span>
              </span>
              <span className="runtime">
                {
                  (this.props.mediaType === "movie") ?
                  (
                    <>
                      <span>Runtime:</span>
                      <span>{this.handleRuntime(detailsItem.runtime)}</span>
                    </>
                  ) : (
                    <>
                      <span>Seasons:</span>
                      <span>{detailsItem.seasons}</span>
                    </>
                  )
                }
                {/* <span>Runtime:</span>
                <span>{this.handleRuntime(detailsItem.runtime)}</span> */}
              </span>

              <div className="genres">
                <span>Genres:</span>
                <span>{genres.join(", ")}</span>
              </div>
            </div>
          </section>

          <div className="overview">{detailsItem.overview}</div>

          {button}
        </section>
      </>
    );
  }
}


const msp = (state, ownProps) => {
  let detailsItem;
  let mediaType = state.ui.mediaType;
  if (ownProps.detailsType === "recommendations") {
    detailsItem = state.entities[ownProps.detailsType][ownProps.detailsRecType][ownProps.detailsId];
  } else {
    detailsItem = state.entities[ownProps.detailsType][`${mediaType}s`][ownProps.detailsId];
  }

  let mediaIdObj = {};
    ///refactor after algorithm
  if (!isEmpty(state.entities.interests)) {
    for (let key in state.entities.interests[`${mediaType}s`]) {
      let mediaId = state.entities.interests[`${mediaType}s`][key].mediaId;
      mediaIdObj[mediaId] = true;
    }
  };

  return {
    detailsItem, 
    genres: state.entities.genres,
    mediaIds: mediaIdObj,
    mediaType
  };
};

const mdp = dispatch => ({
  createInterest: data => dispatch(createInterest(data)),
  deleteInterest: data => dispatch(deleteInterest(data)),
  fetchSimilarRecommendations: data => dispatch(fetchSimilarRecommendations(data)),
  createSimilarRecommendations: data => dispatch(createSimilarRecommendations(data)),
  createAllRecommendations: data => dispatch(createAllRecommendations(data)),
  updateGenre: (genreId, value, mediaType) => dispatch(updateGenre(genreId, value, mediaType)),
  createGenre: genre => dispatch(createGenre(genre))
});

export default connect(msp, mdp)(Details);