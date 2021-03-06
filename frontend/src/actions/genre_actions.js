import * as GenreApiUtil from '../util/genre_api_util';

export const RECEIVE_GENRES = "RECEIVE_GENRES";
export const RECEIVE_GENRE = "RECEIVE_GENRE";
// export const ADD_GENRE = "ADD_GENRE";
// export const UPDATE_GENRE = "UPDATE_GENRE";

// export const receiveGenres = genres => {
//   return {
//   type: RECEIVE_GENRES,
//   genres
// }};

export const receiveGenres = genres => ({
  type: RECEIVE_GENRES,
  genres
});

export const receiveGenre = genre => ({
  type: RECEIVE_GENRE,
  genre
});

export const fetchGenres = () => dispatch => (
  GenreApiUtil.fetchGenres()
    .then(genres => dispatch(receiveGenres(genres)))
    .catch(err => console.log(err))
);

export const createGenre = data => dispatch => {
  return GenreApiUtil.createGenre(data)
    .then(genre => dispatch(receiveGenre(genre)))
    .catch(err => console.log(err));
};

export const updateGenre = (genreId, value) => dispatch => (
  GenreApiUtil.updateGenre(genreId, value)
    .then(genre => dispatch(receiveGenre(genre)))
    .catch(err => console.log(err))
);

// 
export const updateGenres = (genreIds, value) => dispatch => (
  GenreApiUtil.updateGenres(genreIds, value)
    .then(genres => dispatch(receiveGenres(genres)))
    .catch(err => console.log(err))
);