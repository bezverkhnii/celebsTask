import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

type CardProps = {
  children: React.ReactNode;
  index: number;
  contentOffsetX: SharedValue<number>;
};

export const SEPARATOR_WIDTH_BY_DESIGN = 12;
export const CARD_INACTIVE_WIDTH_BY_DESIGN = 256;
export const CARD_INACTIVE_WIDTH =
  CARD_INACTIVE_WIDTH_BY_DESIGN + SEPARATOR_WIDTH_BY_DESIGN;
export const CARD_INACTIVE_HEIGHT = 340;
export const CARD_ACTIVE_WIDTH = 300;
export const CARD_ACTIVE_HEIGHT = 380;
export const SCALE_X = CARD_INACTIVE_WIDTH / CARD_ACTIVE_WIDTH;
export const SCALE_Y = CARD_INACTIVE_HEIGHT / CARD_ACTIVE_HEIGHT;
export const PAGE_WIDTH = CARD_ACTIVE_WIDTH;

const Card: React.FC<CardProps> = ({children, index, contentOffsetX}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * PAGE_WIDTH,
      index * PAGE_WIDTH,
      (index + 1) * PAGE_WIDTH,
    ];
    const scaleX = interpolate(
      contentOffsetX.value,
      inputRange,
      [SCALE_X, 1, SCALE_X],
      Extrapolate.CLAMP,
    );
    const scaleY = interpolate(
      contentOffsetX.value,
      inputRange,
      [SCALE_Y, 1, SCALE_Y],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{scaleX}, {scaleY}],
    };
  }, []);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

const ActorDetailsScreen = ({route}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const celeb = route.params.celebrity;
  // console.log(celeb.known_for, 'knowm');
  const movies = celeb.known_for.map(i => ({
    movie: i.name || i.original_title || '',
    year: i.release_date || i.first_air_date,
    poster: i.poster_path,
    backdrop: i.backdrop_path,
    overview: i.overview,
  }));
  // console.log(movies);
  const {width} = useWindowDimensions();
  const contentOffset = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler(
    {
      onScroll: e => {
        contentOffset.value = e.contentOffset.x;
      },
    },
    [],
  );

  const slideIndex = useDerivedValue(() => {
    return contentOffset.value < width / 2
      ? 0
      : Math.round(contentOffset.value / width);
  });

  useDerivedValue(() => {
    runOnJS(setSlideIdx)(slideIndex.value);
  });

  console.log(slideIdx);
  return (
    <View>
      <Animated.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        disableIntervalMomentum
        decelerationRate="fast"
        snapToInterval={PAGE_WIDTH}
        onScroll={onScrollHandler}
        contentContainerStyle={{
          paddingHorizontal: (width - PAGE_WIDTH) / 2,
        }}>
        {movies.map((movie, idx) => (
          <Card key={movie.movie} index={idx} contentOffsetX={contentOffset}>
            <FastImage
              source={{
                uri: `https://image.tmdb.org/t/p/w300${movie.poster}`,
                priority: FastImage.priority.normal,
              }}
              style={styles.poster}
            />
          </Card>
        ))}
      </Animated.ScrollView>
      <View style={styles.profileSection}>
        <FastImage
          source={{
            uri: `https://image.tmdb.org/t/p/w300${celeb.profile_path}`,
            priority: FastImage.priority.normal,
          }}
          style={styles.actorPhoto}
        />
        <View>
          <Text>{celeb.name}</Text>
          <Text>Known for playing in: {movies[slideIdx].movie}</Text>
          <Text>Release Date: {movies[slideIdx].year}</Text>
        </View>
      </View>
      <Text>{movies[slideIdx].overview}</Text>
    </View>
  );
};

export default ActorDetailsScreen;

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  poster: {
    width: 300,
    height: 380,
  },

  actorPhoto: {
    width: 100,
    height: 150,
  },
});
