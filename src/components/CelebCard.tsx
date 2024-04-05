import React, {useContext, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import HeartIcon, {LikedState} from './HeartIcon';
import OpacityPressable from './OpacityPressable';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {FilterContext} from '../context/FilterContext';

const CelebCard = ({celeb}) => {
  const {navigate} = useNavigation();
  const {celebLikedState, setLikedType} = useContext(FilterContext);

  const likedState = useMemo(
    () => celebLikedState[celeb.id] || LikedState.UNSET,
    [celebLikedState, celeb.id],
  );

  const handleDislike = () => {
    if (likedState === LikedState.DISLIKED) {
      setLikedType(celeb.id, LikedState.UNSET);
    } else {
      setLikedType(celeb.id, LikedState.DISLIKED);
    }
  };

  const handleLike = () => {
    if (likedState === LikedState.LIKED) {
      setLikedType(celeb.id, LikedState.UNSET);
    } else {
      setLikedType(celeb.id, LikedState.LIKED);
    }
  };

  const position = useSharedValue(0);
  const dislikeGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      'worklet';
      runOnJS(handleDislike)();
    })
    .onEnd((event, ctx) => {
      position.value = withSpring(0);
    });

  const likeGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      'worklet';
      runOnJS(handleLike)();
    })
    .onEnd((event, ctx) => {
      position.value = withSpring(0);
    });

  const composed = Gesture.Simultaneous(likeGesture, dislikeGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: position.value}],
  }));
  const handlePress = () => {
    navigate('ActorDetails', {
      celebrity: celeb,
    });
  };

  const color = useMemo(() => {
    switch (celeb.gender) {
      case 1:
        return '#ffd7de';
      case 2:
        return '#96bbdf';
      case 3:
        return '#c287c2';
      default:
        return 'white';
    }
  }, [celeb.gender]);

  return (
    <GestureDetector gesture={composed}>
      <OpacityPressable onPress={handlePress}>
        <Animated.View
          style={[styles.container, {backgroundColor: color}, animatedStyle]}>
          <FastImage
            source={{
              uri: `https://image.tmdb.org/t/p/w300${celeb.profile_path}`,
              priority: FastImage.priority.normal,
            }}
            style={styles.image}
          />
          <View style={styles.actorInfo}>
            <Text style={styles.name}>{celeb.name}</Text>
            <Text>Department: {celeb.known_for_department}</Text>
          </View>
          <View style={{paddingRight: 30}}>
            <HeartIcon likedState={likedState} />
          </View>
        </Animated.View>
      </OpacityPressable>
    </GestureDetector>
  );
};

export default CelebCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actorInfo: {
    width: 170,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  image: {
    width: 100,
    height: 100,
  },
});
