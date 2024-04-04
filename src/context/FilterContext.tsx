import {createContext, useEffect, useMemo, useState} from 'react';
import {useCelebrities} from '../hooks/useCelebrities';

export const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const {celebrities, loading} = useCelebrities();

  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [genderFilter, setGenderFilter] = useState();
  const [mediaTypesFilter, setMediaTypesFilter] = useState();
  const [originalLanguageFilter, setOriginalLanguageFilter] = useState();
  const [likedIds, setLikedIds] = useState([]);
  const [dislikedIds, setDislikedIds] = useState([]);

  useEffect(() => {
    const departments = new Set();
    celebrities.map(celeb => departments.add(celeb.known_for_department));
    const departmentConstants = Array.from(departments);
    setDepartmentTypes(departmentConstants);
    setDepartmentFilter(departmentConstants);
  }, [celebrities]);

  const filteredData = useMemo(() => {
    return celebrities.filter(celeb =>
      departmentFilter.includes(celeb.known_for_department),
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
    setGenderFilter,
    mediaTypesFilter,
    setMediaTypesFilter,
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
