import React, {ReactNode} from 'react';
import {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {useCelebrities} from '../hooks/useCelebrities';

import {ICelebLikedState, IFilterContext, LikedState} from '../types';
const initialState = {
  departmentFilter: [],
  departmentTypes: [],
  setDepartmentFilter: () => [],
  genderFilter: [],
  genderTypes: [],
  setGenderFilter: () => [],
  mediaTypes: [],
  mediaTypesFilter: [],
  setMediaTypesFilter: () => [],
  originalLanguageTypes: [],
  originalLanguageFilter: [],
  setOriginalLanguageFilter: () => [],
  celebLikedState: {},
  setLikedType: () => [],
  likesFilter: [],
  setLikesFilter: () => [],
  filteredData: [],
  loading: true,
};

export const FilterContext = createContext<IFilterContext>(initialState);

export const FilterProvider = ({children}: {children: ReactNode}) => {
  const {celebrities, loading} = useCelebrities();

  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [departmentTypes, setDepartmentTypes] = useState<string[]>([]);
  const [genderTypes, setGenderTypes] = useState<string[]>([]);
  const [genderFilter, setGenderFilter] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [mediaTypesFilter, setMediaTypesFilter] = useState<string[]>([]);
  const [originalLanguageTypes, setOriginalLanguageTypes] = useState<string[]>(
    [],
  );

  const [originalLanguageFilter, setOriginalLanguageFilter] = useState<
    string[]
  >([]);
  const [likesFilter, setLikesFilter] = useState<LikedState[]>(
    Object.values(LikedState),
  );
  const [celebLikedState, setCelebLikedState] = useState({});
  const setLikedType = useCallback((celebID: number, type: LikedState) => {
    setCelebLikedState(curr => ({...curr, [celebID]: type}));
  }, []);

  useEffect(() => {
    const departments = new Set<string>();
    const genders = new Set<string>();
    const originalLanguages = new Set<string>();
    const mediaTypesSet = new Set<string>();

    celebrities.forEach(celeb => {
      if (celeb.known_for_department) {
        departments.add(celeb.known_for_department);
      }

      if (celeb.gender) {
        genders.add(`${celeb.gender}`);
      }

      (celeb.known_for || []).forEach(movie => {
        mediaTypesSet.add(movie.media_type);
        originalLanguages.add(movie.original_language);
      });
    });

    setDepartmentTypes(Array.from(departments));
    setDepartmentFilter(Array.from(departments));
    setGenderTypes(Array.from(genders));
    setGenderFilter(Array.from(genders));
    setMediaTypes(Array.from(mediaTypesSet));
    setMediaTypesFilter(Array.from(mediaTypesSet));
    setOriginalLanguageTypes(Array.from(originalLanguages));
    setOriginalLanguageFilter(Array.from(originalLanguages));
  }, [celebrities]);

  const filteredData = useMemo(() => {
    return celebrities.filter(celeb => {
      const likedState =
        (celebLikedState as ICelebLikedState)[celeb.id] || LikedState.UNSET;
      return (
        departmentFilter.includes(celeb.known_for_department) &&
        genderFilter.includes(`${celeb.gender}`) &&
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
