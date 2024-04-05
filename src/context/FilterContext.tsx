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
  const [unmarkedIds, setUnmarkedIds] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [dislikedIds, setDislikedIds] = useState([]);
  const [marksFilter, setMarksFilter] = useState([
    'liked',
    'disliked',
    'unmarked',
  ]);

  useEffect(() => {
    const departments = new Set();
    const genders = new Set();
    const originalLanguages = new Set();

    // Iterate over celebrities array to collect data
    celebrities.forEach(celeb => {
      // Add known_for_department to departments set
      departments.add(celeb.known_for_department);

      // Add gender to genders set
      genders.add(celeb.gender);

      // Extract original languages from known_for array and add to originalLanguages set
      celeb.known_for.forEach(movie => {
        originalLanguages.add(movie.original_language);
      });

      setUnmarkedIds(prev => [...prev, celeb.id]);
    });

    // Convert sets to arrays
    const departmentConstants = Array.from(departments);
    const gendersConstants = Array.from(genders);
    const originalLanguageConstants = Array.from(originalLanguages);

    // Set state with the collected data
    setDepartmentTypes(departmentConstants);
    setDepartmentFilter(departmentConstants);
    setGenderTypes(gendersConstants);
    setGenderFilter(gendersConstants);
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
    unmarkedIds,
    setUnmarkedIds,
    marksFilter,
    setMarksFilter,
    filteredData,
    loading,
  };

  return (
    <FilterContext.Provider value={shared}>{children}</FilterContext.Provider>
  );
};
