import {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {useCelebrities} from '../hooks/useCelebrities';
import {LikedState} from '../components/HeartIcon';

export const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const {celebrities, loading} = useCelebrities();

  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [genderTypes, setGenderTypes] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [mediaTypesFilter, setMediaTypesFilter] = useState([]);
  const [originalLanguageTypes, setOriginalLanguageTypes] = useState([]);
  const [originalLanguageFilter, setOriginalLanguageFilter] = useState([]);
  const [likesFilter, setLikesFilter] = useState(Object.values(LikedState));
  const [celebLikedState, setCelebLikedState] = useState({});
  const setLikedType = useCallback((celebID: string, type: LikedState) => {
    setCelebLikedState(curr => ({...curr, [celebID]: type}));
  }, []);

  useEffect(() => {
    const departments = new Set();
    const genders = new Set();
    const originalLanguages = new Set();
    const mediaTypesSet = new Set();

    // Iterate over celebrities array to collect data
    celebrities.forEach(celeb => {
      // Add known_for_department to departments set
      if (celeb.known_for_department) {
        departments.add(celeb.known_for_department);
      }

      // Add gender to genders set
      if (celeb.gender) {
        genders.add(celeb.gender);
      }

      (celeb.known_for || []).forEach(movie => {
        mediaTypesSet.add(movie.media_type);
        originalLanguages.add(movie.original_language);
      });
    });

    // Convert sets to arrays
    const departmentConstants = Array.from(departments);
    const gendersConstants = Array.from(genders);
    const originalLanguageConstants = Array.from(originalLanguages);
    const mediaTypesConstants = Array.from(mediaTypesSet);
    // Set state with the collected data
    setDepartmentTypes(departmentConstants);
    setDepartmentFilter(departmentConstants);
    setGenderTypes(gendersConstants);
    setGenderFilter(gendersConstants);
    setMediaTypes(mediaTypesConstants),
      setMediaTypesFilter(mediaTypesConstants);
    setOriginalLanguageTypes(originalLanguageConstants);
    setOriginalLanguageFilter(originalLanguageConstants);
  }, [celebrities]);

  const filteredData = useMemo(() => {
    return celebrities.filter(celeb => {
      const likedState = celebLikedState[celeb.id] || LikedState.UNSET;
      return (
        departmentFilter.includes(celeb.known_for_department) &&
        genderFilter.includes(celeb.gender) &&
        (celeb.known_for || [])
          .map(movie => movie.media_type)
          .some(type => mediaTypesFilter.includes(type)) &&
        (celeb.known_for || [])
          .map(movie => movie.original_language)
          .some(lang => originalLanguageFilter.includes(lang)) &&
        likesFilter.includes(likedState)
      );
    });
  }, [
    celebrities,
    departmentFilter,
    genderFilter,
    mediaTypesFilter,
    originalLanguageFilter,
    celebLikedState,
    likesFilter,
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
    celebLikedState,
    setLikedType,
    likesFilter,
    setLikesFilter,
    filteredData,
    loading,
  };

  return (
    <FilterContext.Provider value={shared}>{children}</FilterContext.Provider>
  );
};
