import {useState, useEffect} from 'react';
import {getMoviesByPage} from '../api/moviedbAPI';
import {ICelebrity} from '../types';
import {uniqBy} from 'lodash';

export const useCelebrities = () => {
  const [loading, setLoading] = useState(true);
  const [celebrities, setCelebrities] = useState<ICelebrity[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page <= 25) {
      (async () => {
        try {
          const response = await getMoviesByPage(page);
          const data = response.data.results;
          setCelebrities(prevCelebrities => prevCelebrities.concat(data));
        } catch (error) {
          console.error(error);
        } finally {
          setPage(currPage => currPage + 1);
        }
      })();
    } else {
      setCelebrities(prevCelebrities => {
        return uniqBy(prevCelebrities, 'id').sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      });
      setLoading(false);
    }
  }, [page]);

  return {celebrities, loading};
};
