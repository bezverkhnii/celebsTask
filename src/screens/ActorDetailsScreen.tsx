import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const ActorDetailsScreen = ({route}) => {
  const celeb = route.params.celebrity;
  const movies = celeb.known_for.map(i => ({
    movie: i.name || i.original_title || '',
    year: i.first_air_date,
    poster: i.poster_path,
    backdrop: i.backdrop_path,
  }));
  console.log(celeb.known_for[0].first_air_date);
  console.log(movies);
  return (
    <View>
      <View>
        <ScrollView horizontal={true}>
          {movies.map(movie => (
            <Image
              key={movie.movie}
              source={{uri: `https://image.tmdb.org/t/p/w300${movie.poster}`}}
              width={150}
              height={200}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w300${celeb.profile_path}`,
          }}
          width={100}
          height={150}
        />
        <View>
          <Text>{celeb.name}</Text>
          <Text>Known for playing in: {movies[0].movie}</Text>
          <Text>Release Date: {movies[0].year}</Text>
          <Text>Gender: {celeb.gender}</Text>
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
});
