import {createContext, useEffect, useMemo, useState} from 'react';
import {useCelebrities} from '../hooks/useCelebrities';

export const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const {celebrities, loading} = useCelebrities();

  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [genderTypes, setGenderTypes] = useState();
  const [genderFilter, setGenderFilter] = useState();
  const [mediaTypes, setMediaTypes] = useState(['movie', 'tv']);
  const [mediaTypesFilter, setMediaTypesFilter] = useState(mediaTypes);
  const [originalLanguageTypes, setOriginalLanguageTypes] = useState();
  const [originalLanguageFilter, setOriginalLanguageFilter] = useState();
  const [likedIds, setLikedIds] = useState([]);
  const [dislikedIds, setDislikedIds] = useState([]);

  useEffect(() => {
    const departments = new Set();
    celebrities.map(celeb => departments.add(celeb.known_for_department));
    const departmentConstants = Array.from(departments);
    setDepartmentTypes(departmentConstants);
    setDepartmentFilter(departmentConstants);

    const genders = new Set();
    celebrities.map(celeb => genders.add(celeb.gender));
    const gendersConstants = Array.from(genders);
    setGenderTypes(gendersConstants);
    setGenderFilter(gendersConstants);

    const originalLanguages = new Set();
    celebrities.map(celeb =>
      celeb.known_for
        .map(movie => movie.original_language)
        .map(lang => originalLanguages.add(lang)),
    );
    const originalLanguageConstants = Array.from(originalLanguages);
    setOriginalLanguageTypes(originalLanguageConstants);
    setOriginalLanguageFilter(originalLanguageConstants);
    // celebrities.map(celeb => originalLanguages.add(celeb))
  }, [celebrities]);

  const filteredData = useMemo(() => {
    return celebrities.filter(
      celeb =>
        departmentFilter.includes(celeb.known_for_department) &&
        genderFilter.includes(celeb.gender) &&
        celeb.known_for
          .map(movie => movie.media_type)
          .every(el => mediaTypesFilter.includes(el)) &&
        celeb.known_for
          .map(movie => movie.original_language)
          .some(el => originalLanguageFilter.includes(el)),
    );
  }, [
    celebrities,
    departmentFilter,
    genderFilter,
    mediaTypesFilter,
    originalLanguageFilter,
    likedIds,
    dislikedIds,
  ]);

  const shared = {
    departmentFilter,
    departmentTypes,
    setDepartmentFilter,
    genderFilter,
    genderTypes,
    setGenderFilter,
    mediaTypes,
    mediaTypesFilter,
    setMediaTypesFilter,
    originalLanguageTypes,
    originalLanguageFilter,
    setOriginalLanguageFilter,
    likedIds,
    setLikedIds,
    dislikedIds,
    setDislikedIds,
    filteredData,
    loading,
  };

  return (
    <FilterContext.Provider value={shared}>{children}</FilterContext.Provider>
  );
};
