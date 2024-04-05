import {LikedState} from '../components/HeartIcon';

export interface ICelebState {
  celebId: string | number;
  likedState: LikedState;
}

export type RootStackParamList = {
  CelebritiesList: undefined;

  ActorDetails: {celebrity: any};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
