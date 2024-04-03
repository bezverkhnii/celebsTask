import {useState, useEffect} from 'react';
import {getMoviesByPage} from '../api/moviedbAPI';

export const useCelebrities = () => {
  const [loading, setLoading] = useState(true);
  const [celebrities, setCelebrities] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getCelebrities = async () => {
      try {
        //@ts-expect-error
        const response = await getMoviesByPage(page).get();
        const data = response.data.results;
        //@ts-expect-error
        setCelebrities(prevCelebrities => [...prevCelebrities, ...data]);
        console.log(page);
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      }
    };
    if (page <= 25) {
      getCelebrities();
    } else {
      setLoading(false);
    }
  }, [page]);

  return {celebrities, loading};
};
