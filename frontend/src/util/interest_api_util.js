import axios from 'axios';

export const getInterests = type => {
  return axios.get(`/api/interests/${type}`);
};

export const addInterest = data => {
  return axios.post('/api/interests/', data);
};

export const deleteInterest = data => {
  return axios.delete(`api/interests/${data._id}`, {data});
};