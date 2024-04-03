import axios from 'axios';

export const moviedbImageAPI = axios.create({
  baseURL: 'https://image.tmdb.org/t/p/w300',
});
