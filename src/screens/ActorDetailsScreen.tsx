import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../types';
import {useNavigation, useRoute} from '@react-navigation/native';

type CardProps = {
  children: React.ReactNode;
  index: number;
  contentOffsetX: SharedValue<number>;
};

const SEPARATOR_WIDTH_BY_DESIGN = 12;
const CARD_INACTIVE_WIDTH_BY_DESIGN = 256;
const CARD_INACTIVE_WIDTH =
  CARD_INACTIVE_WIDTH_BY_DESIGN + SEPARATOR_WIDTH_BY_DESIGN;
const CARD_INACTIVE_HEIGHT = 340;
const CARD_ACTIVE_WIDTH = 300;
const CARD_ACTIVE_HEIGHT = 380;
const SCALE_X = CARD_INACTIVE_WIDTH / CARD_ACTIVE_WIDTH;
const SCALE_Y = CARD_INACTIVE_HEIGHT / CARD_ACTIVE_HEIGHT;
const PAGE_WIDTH = CARD_ACTIVE_WIDTH;

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
      Extrapolation.CLAMP,
    );
    const scaleY = interpolate(
      contentOffsetX.value,
      inputRange,
      [SCALE_Y, 1, SCALE_Y],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{scaleX}, {scaleY}],
    };
  }, []);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

type NavigationProps = StackScreenProps<RootStackParamList, 'ActorDetails'>;

const ActorDetailsScreen = () => {
  const {setOptions} = useNavigation();
  const {params} = useRoute<NavigationProps['route']>();
  const [slideIdx, setSlideIdx] = useState(0);
  const celeb = params.celebrity;
  const movies = celeb.known_for.map(movie => ({
    movie: movie.name || movie.original_title || '',
    year: movie.release_date || movie.first_air_date,
    poster: movie.poster_path,
    backdrop: movie.backdrop_path,
    overview: movie.overview,
  }));

  useEffect(() => {
    setOptions({
      headerTitle: celeb.name,
    });
  }, [setOptions, celeb.name]);

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

  const {bottom} = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{paddingBottom: bottom || 8}}>
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
        <View style={styles.actorDescription}>
          <Text style={styles.actorName}>{celeb.name}</Text>
          <Text style={styles.descriptionText}>
            {'Known for playing in: '}
            <Text style={styles.bold}>{movies[slideIdx].movie}</Text>
          </Text>
          <Text style={styles.descriptionText}>
            {'Release Date: '}
            <Text style={styles.bold}>{movies[slideIdx].year}</Text>
          </Text>
        </View>
      </View>
      <View style={styles.movieOverview}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.descriptionText}>{movies[slideIdx].overview}</Text>
      </View>
    </ScrollView>
  );
};

export default ActorDetailsScreen;

const styles = StyleSheet.create({
  profileSection: {
    padding: 10,
    flexDirection: 'row',
  },
  poster: {
    width: 300,
    height: 450,
  },

  actorPhoto: {
    width: 150,
    height: 200,
  },

  actorName: {
    fontWeight: '600',
    fontSize: 20,
  },
  actorDescription: {
    flex: 1,
    marginHorizontal: 8,
  },

  bold: {
    fontWeight: '600',
  },

  movieOverview: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  overviewTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  descriptionText: {
    fontSize: 16,
  },
});
