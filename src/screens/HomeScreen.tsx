/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CelebTab from '../components/CelebTab';
import {useCelebrities} from '../../src/hooks/useCelebrities';

const HomeScreen = () => {
  const {celebrities, loading} = useCelebrities();
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <FlashList
          data={celebrities}
          keyExtractor={item => item.id}
          renderItem={({item}) => <CelebTab celeb={item} />}
          estimatedItemSize={200}
          ListHeaderComponent={loading ? ActivityIndicator : null}
          //   ListFooterComponent={loading ? ActivityIndicator : null}
          contentContainerStyle={styles.padding}
        />
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
