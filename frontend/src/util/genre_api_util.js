import axios from 'axios';

export const fetchGenres = () => {
  return axios.get("/api/genres");
};

// export const fetchMovieGenres = () => {

// }

export const createGenre = data => {

  return axios.post("/api/genres", data);
};

// export const updateGenre = data => {
//   return axios.patch("/api/genres", data);
// };

export const updateGenre = (genreId, data) => {
  return axios.patch(`/api/genres/${genreId}`, data);
};
// export const updateGenre = (genreId, value, mediaType) => {
//   return axios.patch(`/api/genres/${genreId}`, value, mediaType);
// };