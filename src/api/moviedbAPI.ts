import axios from 'axios';

const apiKey = '6dc98460ed6af0665227c4cec2791e82';

export const getMoviesByPage = page => {
  return axios.create({
    baseURL: `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`,
    params: {
      page: page,
      api_key: apiKey,
    },
  });
};
