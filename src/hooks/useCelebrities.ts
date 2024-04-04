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

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      const celebMap = new Map();
      celebrities.forEach(celeb => {
        celebMap.set(celeb.id, celeb);
      });

      // Extract celeb objects from the map to get unique celebs
      const uniqueData = Array.from(celebMap.values());
      setCelebrities(uniqueData);
      setCelebrities(prevCelebrities =>
        prevCelebrities.sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }),
      );
      setLoading(false);
    }
  }, [loading]);

  return {celebrities, setCelebrities, loading};
};
