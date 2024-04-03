import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HeartIcon from './HeartIcon';
import OpacityPressable from './OpacityPressable';
import {useNavigation} from '@react-navigation/native';

const END_POSITION = 200;

const CelebTab = ({celeb}) => {
  const imageUrl = celeb.profile_path;
  const imagePath = `https://image.tmdb.org/t/p/w300${imageUrl}`;
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);

  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (onLeft.value) {
        position.value = e.translationX;
      } else {
        position.value = END_POSITION + e.translationX;
      }
    })
    .onEnd(e => {
      if (position.value > END_POSITION / 2) {
        position.value = withTiming(END_POSITION, {duration: 100});
        onLeft.value = false;
      } else {
        position.value = withTiming(0, {duration: 100});
        onLeft.value = true;
      }
    });

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
    // <GestureDetector gesture={panGesture}>
    <OpacityPressable onPress={handlePress}>
      <View style={[styles.container, {backgroundColor: color}]}>
        <View>
          <Image source={{uri: imagePath}} width={100} height={100} />
        </View>
        <View style={styles.actorInfo}>
          <Text style={styles.name}>{celeb.name}</Text>
          <Text>Department: {celeb.name}</Text>
          <Text>Gender: {celeb.gender}</Text>
        </View>
        <View style={{paddingRight: 30}}>
          <HeartIcon liked={true} />
        </View>
      </View>
    </OpacityPressable>
    // </GestureDetector>
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
});
