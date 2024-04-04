/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {FlashList} from '@shopify/flash-list';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CelebTab from '../components/CelebTab';
import {useCelebrities} from '../../src/hooks/useCelebrities';
import SearchBar from '../components/SearchBar';

const HomeScreen = () => {
  const {celebrities, setCelebrities, loading} = useCelebrities();

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlashList
            data={celebrities}
            // keyExtractor={()} //some items has the same id
            renderItem={({item}) => <CelebTab celeb={item} />}
            estimatedItemSize={200}
            ListHeaderComponent={() => <SearchBar celebrities={celebrities} />}
            //   ListFooterComponent={loading ? ActivityIndicator : null}
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
