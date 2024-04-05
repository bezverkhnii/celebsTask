import React, {ReactNode} from 'react';
import {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {useCelebrities} from '../hooks/useCelebrities';
import {LikedState} from '../components/HeartIcon';
import {ICelebLikedState, IFilterContext} from '../types';

//@ts-expect-error
export const FilterContext = createContext<IFilterContext>();

export const FilterProvider = ({children}: {children: ReactNode}) => {
  const {celebrities, loading} = useCelebrities();

  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);
  const [departmentTypes, setDepartmentTypes] = useState<string[]>([]);
  const [genderTypes, setGenderTypes] = useState<number[]>([]);
  const [genderFilter, setGenderFilter] = useState<number[]>([]);
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
    setDepartmentTypes(departmentConstants as string[]);
    setDepartmentFilter(departmentConstants as string[]);
    setGenderTypes(gendersConstants as number[]);
    setGenderFilter(gendersConstants as number[]);
    setMediaTypes(mediaTypesConstants as string[]);
    setMediaTypesFilter(mediaTypesConstants as string[]);
    setOriginalLanguageTypes(originalLanguageConstants as string[]);
    setOriginalLanguageFilter(originalLanguageConstants as string[]);
  }, [celebrities]);

  const filteredData = useMemo(() => {
    return celebrities.filter(celeb => {
      const likedState =
        (celebLikedState as ICelebLikedState)[celeb.id] || LikedState.UNSET;
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
    //@ts-expect-error
    <FilterContext.Provider value={shared}>{children}</FilterContext.Provider>
  );
};
