import {FlashList} from '@shopify/flash-list';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CelebCard from '../components/CelebCard';
import SideMenu from '../components/SideMenu';
import {FilterContext} from '../context/FilterContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import OpacityPressable from '../components/OpacityPressable';
import FilterIcon from '../assets/images/filter.png';
import CloseIcon from '../assets/images/close.png';
import EmptyIcon from '../assets/images/EmptyIcon.png';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {ICelebrity, IFilterContext} from '../types';

const HomeScreen = () => {
  const {setOptions} = useNavigation();
  const {filteredData, loading} = useContext<IFilterContext>(FilterContext);
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <OpacityPressable onPress={() => setIsOpen(!isOpen)}>
          <FastImage
            source={isOpen ? CloseIcon : FilterIcon}
            style={styles.icon}
          />
        </OpacityPressable>
      ),
    });
  }, [setOptions, isOpen]);

  const data = useMemo(() => {
    return filteredData.filter((celeb: ICelebrity) =>
      celeb.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [filteredData, searchText]);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyComponentContainer}>
        <FastImage source={EmptyIcon} style={styles.emptyIcon} />
        <Text>
          {searchText.length
            ? `Nothing found for "${searchText}" request`
            : 'Nothing found for requested filters'}
        </Text>
      </View>
    );
  }, [searchText]);

  return (
    <View style={styles.container}>
      <SideMenu isOpen={isOpen} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          onChangeText={e => setSearchText(e)}
          value={searchText}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} />
      ) : (
        <FlashList
          data={data}
          keyExtractor={(item: ICelebrity) => String(item.id)}
          renderItem={({item}) => <CelebCard celeb={item} />}
          estimatedItemSize={200}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{...styles.padding, paddingBottom: bottom}}
        />
      )}
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  padding: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    paddingVertical: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    padding: 10,
    fontSize: 15,
  },

  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 16,
  },

  loadingIndicator: {
    marginVertical: 24,
  },

  emptyComponentContainer: {
    marginTop: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyIcon: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
});
