import axios from 'axios';

export const getInterests = type => {
  // debugger
  return axios.get(`/api/interests/${type}`);
};

// export const getMovieInterests = data => {
//   return axios.get(`/api/interests`, data);
// };

// export const getTVInterests = data => {

// }

export const addInterest = data => {
  return axios.post('/api/interests/', data);
};

export const deleteInterest = interestId => {
  return axios.delete(`api/interests/${interestId}`);
};