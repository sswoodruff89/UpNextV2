import axios from 'axios';

export const fetchRecommendations = () => {
  return axios.get(`/api/recommendations`);
};

export const fetchSimilarRecommendations = (mediaType) => {
  return axios.get(`/api/recommendations/similar/${mediaType}`);
  // return axios.get('/api/recommendations/similar');
};

export const createSimilarRecommendations = (data) => {
  return axios.post('/api/recommendations/similar', { data });
};

export const fetchAllRecommendations = mediaType => {
  return axios.get(`/api/recommendations/all/${mediaType}`);
};

export const createAllRecommendations = (data) => {
  return axios.post('/api/recommendations/all', { data });
};

export const deleteSimilarRecommendations = () => {
  return axios.delete('/api/recommendations/similar');
};

export const deleteAllRecommendations = () => {
  return axios.delete('/api/recommendations/all');
};