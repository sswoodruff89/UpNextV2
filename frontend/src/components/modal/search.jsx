import React from 'react';
import { connect } from 'react-redux';
import { createInterest } from '../../actions/interest_actions';
import { createSimilarRecommendations, createAllRecommendations } from '../../actions/recommendation_actions';
import { createGenre, updateGenre, updateGenres } from '../../actions/genre_actions';
import * as TMDBAPIUtil from '../../util/tmdb_api_util';
// const keys = require('../../config/keys');

// had to append REACT_APP at the front of the config var in Heroku in order for
// React to know to embed the var inside process.env
const debounce = require("lodash.debounce");
const isEmpty = require("lodash.isempty");

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      searchResults: []
    };

    this.handleInput = this.handleInput.bind(this);
    this.makeDebouncedSearch = debounce(this.makeDebouncedSearch, 350);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUnmount() {
    // without this, we get a memory leak error
    // after unmounting the debounced function was still getting called, and
      // therefore we were trying to setState for searchResults after the
      // component had already unmounted
    this.makeDebouncedSearch.cancel();
  }

  handleInput(e) {
    let keyword = e.currentTarget.value;

    // 1. make the omdb call to get the final interest the user chose
    if (keyword !== "") {
      this.setState({ keyword });
      this.makeDebouncedSearch(keyword);
    } else {
      this.props.closeModal();
    }
  }

  makeDebouncedSearch(keyword) {
    if (this.props.mediaType === "movie") {
      TMDBAPIUtil.getMovieSuggestions(keyword)
        .then(response => {

          let searchResults = response.data.results;
          
          // Removes any search results that are missing metadata like date or poster
          let sanitizedResults = searchResults.reduce((store, entry) => {
  
            if (!Object.values(entry).some(field => field === null) && !this.props.mediaIds[entry.id]) {
              store.push(entry);
            }
            return store;
          }, []);
  
          if (!isEmpty(sanitizedResults)) {
            sanitizedResults = sanitizedResults.slice(0, 10);
          }
  
          this.setState({
            searchResults: sanitizedResults
          });
        });

    } else if (this.props.mediaType === "tv") {
      TMDBAPIUtil.getTVShowSuggestions(keyword).then((response) => {
        let searchResults = response.data.results;

        // Removes any search results that are missing metadata like date or poster
        let sanitizedResults = searchResults.reduce((store, entry) => {
          if (
            !Object.values(entry).some((field) => field === null) &&
            !this.props.mediaIds[entry.id]
          ) {
            store.push(entry);
          }
          return store;
        }, []);

        if (!isEmpty(sanitizedResults)) {
          sanitizedResults = sanitizedResults.slice(0, 10);
        }

        this.setState({
          searchResults: sanitizedResults,
        });
      });
    }

  }

  // first make a call to omdb to get the full interest info
  // then make a call to our own backend with the return value of that, to add
    // a new interest
  handleClick(id) {
    return e => {
      e.preventDefault();
      const {createInterest, updateGenre, updateGenres, createGenre, mediaType} = this.props;

      TMDBAPIUtil.getMovieInfo(id)
        .then(response => {
          response.data.type = mediaType;
          if (TMDBAPIUtil.hasValidMovieFields(response.data)) {
             Promise.all([createInterest(response.data, mediaType)]).then(() => {
              // genres calculation
              const { genres, mediaIds, mediaType } = this.props;

              // let prevGenreIds = [];

              // // let newGenreIds = [];

              // response.data.genres.forEach(genre => {
              //   if (genres[genre.name]) {
              //     // updateGenre(genres[genre.name]._id, { value: 1, mediaType});
              //     prevGenreIds.push(genres[genre.name]._id);
              //     // updateGenre(genres[genre.name]._id, { value: 1, mediaType});
              //   } else {
              //     // createGenre({genre, mediaType} );
              //     createGenre({genre, mediaType, interestCount: Object.keys(mediaIds).length} );
              //   }
              // });

              // if (prevGenreIds.length) {
              //   updateGenres(prevGenreIds, { value: 1, mediaType });
              // }

              response.data.genres.forEach(genre => {
                if (genres[genre.name]) {
                  updateGenre(genres[genre.name]._id, { value: 1, mediaType});
                } else {
                  // createGenre({genre, mediaType} );
                  this.props.createGenre({genre, mediaType, interestCount: Object.keys(mediaIds).length} );
                }
              });

              this.props.closeModal();
            });
          } else {
            this.props.closeModal();
          }
        });

      // May refactor in the future so that recommendations are made only after and if createInterest and closeModal are successful
      TMDBAPIUtil.getSimilarRecommendations(id)
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

      }
      // TMDBAPIUtil.getSimilarRecommendations(id)
      //   .then(response => {
      //     let count = 0;
      //     let recommendations = [];
      //     let type = this.props.mediaType[0].toUpperCase() + this.props.mediaType.slice(1);

      //     const promises = response.data.results.map((recommendation) => {
      //       let recId = recommendation.id;
      //       return TMDBAPIUtil.getMovieInfo(recId)
      //         .then(media => {
      //           if (!this.props.mediaIds[media.data.id]) {
      //             count += 1;

      //             recommendation.genres = media.data.genres;
      //             recommendation.runtime = media.data.runtime;
      //             ////REVISE
      //             recommendation[`similar${type}Id`] = id;

      //             recommendations.push(recommendation);
      //             if (count === 15) this.props.closeModal();
      //           }
      //         });
      //     });

      //     Promise.all(promises)
      //       .then(() => {
      //         this.props.createSimilarRecommendations(recommendations);
      //         this.props.closeModal();
      //       });
      //   });
  };
  
  
  render() {
    const {searchResults} = this.state;
    
    let sorted = searchResults.sort((a, b) => (a.release_date < b.release_date) ? 1 : -1);

    let results = !isEmpty(searchResults) ? (
      <ul className="search-results">
        {sorted.map((result, idx) => {
          let year = result.release_date.slice(0,4);
          return (
            <li onClick={this.handleClick(result.id)} key={idx}>
              <span>
                {result.title} ({year})
              </span>
            </li>
          );})}
      </ul> ) : "";


    return(
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search..."
          className='search-input'
          onChange={this.handleInput}
          autoFocus/>
        <div>
          {results}
        </div>
      </div>
    );
  }
}

const msp = state => {
  let mediaIdObj = {};
  let tvIdObj = {};
  let mediaType = state.ui.mediaType;
  // let mt = (mediaType === "Movie") ? "movie" : "tv";

  if (!isEmpty(state.entities.interests)) {
    for (let key in state.entities.interests[`${mediaType}s`]) {
      let mediaId = state.entities.interests[`${mediaType}s`][key].mediaId;
      mediaIdObj[mediaId] = true;
    }
  }
    return {
      genres: state.entities.genres,
      interests: state.entities.interests,
      mediaIds: mediaIdObj,
      mediaType
    };
}

const mdp = dispatch => ({
  createInterest: data => dispatch(createInterest(data)),
  createSimilarRecommendations: data => dispatch(createSimilarRecommendations(data)),
  createAllRecommendations: data => dispatch(createAllRecommendations(data)),
  createGenre: data => dispatch(createGenre(data)),
  updateGenre: (genreId, value) => dispatch(updateGenre(genreId, value)),
  updateGenres: (genreIds, value) => dispatch(updateGenres(genreIds, value))
});

export default connect(msp, mdp)(Search);