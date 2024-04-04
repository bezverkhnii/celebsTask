import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';

const ActorDetailsScreen = ({route}) => {
  const celeb = route.params.celebrity;
  console.log(celeb.known_for, 'knowm');
  const movies = celeb.known_for.map(i => ({
    movie: i.name || i.original_title || '',
    year: i.release_date,
    poster: i.poster_path,
    backdrop: i.backdrop_path,
  }));
  console.log(movies);
  return (
    <View>
      <View>
        <ScrollView horizontal={true}>
          {movies.map(movie => (
            <FastImage
              key={movie.movie}
              source={{
                uri: `https://image.tmdb.org/t/p/w300${movie.poster}`,
                priority: FastImage.priority.normal,
              }}
              style={styles.poster}
            />
          ))}
        </ScrollView>
      </View>
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
          <Text>Known for playing in: {movies[0].movie}</Text>
          <Text>Release Date: {movies[0].year}</Text>
        </View>
      </View>
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
    width: 150,
    height: 200,
  },

  actorPhoto: {
    width: 100,
    height: 150,
  },
});
