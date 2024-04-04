import React, {useEffect, useMemo} from 'react';
import {Image, StyleSheet} from 'react-native';
import FilledHeart from '../assets/images/filled-heart.png';
import EmptyHeart from '../assets/images/empty-heart.png';
import BrokenHeart from '../assets/images/dislike.png';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export enum LikedState {
  UNSET,
  LIKED,
  DISLIKED,
}

const HeartIcon = ({likedState}: {likedState: LikedState}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (likedState === LikedState.LIKED) {
      scale.value = withSpring(1.4);
    } else if (likedState === LikedState.DISLIKED) {
      scale.value = withSpring(1.2);
    } else {
      scale.value = withSpring(1);
    }
  }, [likedState, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  const iconSource = useMemo(() => {
    switch (likedState) {
      case LikedState.LIKED:
        return FilledHeart;
      case LikedState.DISLIKED:
        return BrokenHeart;
      default:
        return EmptyHeart;
    }
  }, [likedState]);

  return (
    <Animated.View style={animatedStyle}>
      <Image source={iconSource} style={styles.image} />
    </Animated.View>
  );
};

export default HeartIcon;

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
  },
});
