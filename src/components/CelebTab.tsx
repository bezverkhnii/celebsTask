import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
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
  withTiming,
} from 'react-native-reanimated';
import HeartIcon from './HeartIcon';
import OpacityPressable from './OpacityPressable';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const CelebTab = ({celeb}) => {
  const imageUrl = celeb.profile_path;
  const imagePath = `https://image.tmdb.org/t/p/w300${imageUrl}`;
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);

  const handleDislike = () => {
    console.log('disliked');
    setLiked(false);
  };

  const handleLike = () => {
    console.log('liked');
    setLiked(true);
  };

  const position = useSharedValue(0);
  const dislikeGesture = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      'worklet';
      runOnJS(handleDislike)();
    })
    .onEnd((event, ctx) => {
      position.value = withSpring(0);
    });

  const likeGesture = Gesture.Fling()
    .direction(Directions.LEFT)
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
    navigation.navigate('ActorDetails', {
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
          <View>
            <FastImage
              source={{uri: imagePath, priority: FastImage.priority.normal}}
              style={styles.image}
            />
          </View>
          <View style={styles.actorInfo}>
            <Text style={styles.name}>{celeb.name}</Text>
            <Text>Department: {celeb.known_for_department}</Text>
            <Text>Gender: {celeb.gender}</Text>
          </View>
          <View style={{paddingRight: 30}}>
            <HeartIcon liked={liked} />
          </View>
        </Animated.View>
      </OpacityPressable>
    </GestureDetector>
  );
};

export default CelebTab;

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
