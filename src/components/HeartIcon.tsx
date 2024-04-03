import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import FilledHeart from '../assets/images/filled-heart.png';
import EmptyHeart from '../assets/images/empty-heart.png';
import Animated, {
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const HeartIcon = ({liked = false}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (liked) {
      scale.value = withSpring(1.4);
    } else {
      scale.value = withSpring(1);
    }
  }, [liked]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Image source={liked ? FilledHeart : EmptyHeart} style={styles.image} />
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
