/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {FlashList} from '@shopify/flash-list';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CelebCard from '../components/CelebCard';
import SideMenu from '../components/SideMenu';
import {FilterContext} from '../context/FilterContext';

const HomeScreen = ({navigation}) => {
  const {filteredData, loading} = useContext(FilterContext);
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setIsOpen(!isOpen)} title="Filter" />
      ),
    });
    console.log(isOpen);
  }, [navigation, isOpen]);

  const data = useMemo(() => {
    return filteredData.filter(celeb =>
      celeb.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [filteredData, searchText]);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <SideMenu isOpen={isOpen} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search..."
                onChangeText={e => setSearchText(e)}
                value={searchText}
              />
            </View>
            <FlashList
              data={data}
              keyExtractor={item => item.id} //some items has the same id
              renderItem={({item}) => <CelebCard celeb={item} />}
              estimatedItemSize={200}
              ListEmptyComponent={() => <Text>Nothing here</Text>} //write empty component
              contentContainerStyle={styles.padding}
            />
          </>
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
  inputContainer: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    fontSize: 15,
  },
});
