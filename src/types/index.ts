export enum LikedState {
  UNSET = 'Unset',
  LIKED = 'Liked',
  DISLIKED = 'Disliked',
}

export type RootStackParamList = {
  CelebritiesList: undefined;

  ActorDetails: {celebrity: any};
};
export interface ICelebLikedState {
  [key: string]: LikedState;
}

export interface IMovie {
  movie: string;
  year: string;
  poster: string;
  backdrop: string;
  overview: string;
}

export interface IMovieFields {
  name: string;
  original_title: string;
  release_date: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

export interface IKnownFor {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
export interface ICelebrity {
  adult: boolean;
  gender: number;
  id: number;
  known_for: IKnownFor[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string;
}

export interface IFilterContext {
  departmentFilter: string[];
  departmentTypes: string[];
  setDepartmentFilter: (item: string[]) => void;
  genderFilter: string[];
  genderTypes: string[];
  setGenderFilter: (item: string[]) => void;
  mediaTypes: string[];
  mediaTypesFilter: string[];
  setMediaTypesFilter: (item: string[]) => void;
  originalLanguageTypes: string[];
  originalLanguageFilter: string[];
  setOriginalLanguageFilter: (item: string[]) => void;
  celebLikedState: ICelebLikedState;
  setLikedType: (celebID: number, type: LikedState) => void;
  likesFilter: LikedState[];
  setLikesFilter: (item: LikedState[]) => void;
  filteredData: ICelebrity[];
  loading: boolean;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
