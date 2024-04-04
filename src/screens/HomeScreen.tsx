/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CelebTab from '../components/CelebTab';
import {useCelebrities} from '../../src/hooks/useCelebrities';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const {celebrities, setCelebrities, loading} = useCelebrities();
  const [filteredCelebrities, setFilteredCelebrities] = useState();
  const [searchText, setSearchText] = useState('');
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlashList
            data={searchText ? filteredCelebrities : celebrities}
            // keyExtractor={()} //some items has the same id
            renderItem={({item}) => <CelebTab celeb={item} />}
            estimatedItemSize={200}
            ListHeaderComponent={() => (
              <SearchBar
                celebrities={celebrities}
                searchText={searchText}
                setSearchText={setSearchText}
                setFilteredCelebrities={setFilteredCelebrities}
              />
            )}
            //   ListFooterComponent={loading ? ActivityIndicator : null}
            ListEmptyComponent={() => <Text>Nothing here</Text>} //holder
            contentContainerStyle={styles.padding}
          />
        )}
      </GestureHandlerRootView>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 10,
  },
});
