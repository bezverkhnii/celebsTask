import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {MultiSelect} from 'react-native-element-dropdown';
import {FilterContext} from '../context/FilterContext';
import {ScrollView} from 'react-native-gesture-handler';
import {LikedState} from '../types';

const SideMenu = ({isOpen}: {isOpen: boolean}) => {
  const {
    departmentTypes,
    departmentFilter,
    setDepartmentFilter,
    genderTypes,
    genderFilter,
    setGenderFilter,
    mediaTypes,
    mediaTypesFilter,
    setMediaTypesFilter,
    originalLanguageTypes,
    originalLanguageFilter,
    setOriginalLanguageFilter,
    likesFilter,
    setLikesFilter,
  } = useContext(FilterContext);
  const menuWidth = useSharedValue(0);

  const departmentValues = departmentTypes.map(type => ({
    label: type,
    value: type,
  }));

  const genderValues = genderTypes.map(type => ({
    label:
      type === '0'
        ? 'Not specified'
        : type === '1'
        ? 'Female'
        : type === '2'
        ? 'Male'
        : 'Non-binary',
    value: type,
  }));

  const mediaTypesValues = mediaTypes.map(type => ({
    label: type,
    value: type,
  }));

  const originalLanguageValues = originalLanguageTypes.map(type => ({
    label: type,
    value: type,
  }));

  const likesValues = Object.values(LikedState).map(type => ({
    label: type,
    value: type,
  }));

  useEffect(() => {
    if (!isOpen) {
      menuWidth.value = withTiming(0);
    } else {
      menuWidth.value = withTiming(250);
    }
  }, [isOpen, menuWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: menuWidth.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ScrollView
        contentContainerStyle={[styles.menuContent, {paddingBottom: 100 || 8}]}>
        <MultiSelect
          placeholder="Filter by department"
          data={departmentValues}
          labelField="label"
          valueField="value"
          value={departmentFilter}
          onChange={item => {
            setDepartmentFilter(item);
          }}
        />
        <MultiSelect
          placeholder="Filter by gender"
          data={genderValues}
          labelField="label"
          valueField="value"
          value={genderFilter}
          onChange={item => {
            setGenderFilter(item);
          }}
        />
        <MultiSelect
          placeholder="Filter by media type"
          data={mediaTypesValues}
          labelField="label"
          valueField="value"
          value={mediaTypesFilter}
          onChange={item => {
            setMediaTypesFilter(item);
          }}
        />
        <MultiSelect
          placeholder="Filter by original langauge"
          data={originalLanguageValues}
          labelField="label"
          valueField="value"
          value={originalLanguageFilter}
          onChange={item => {
            setOriginalLanguageFilter(item);
          }}
        />
        <MultiSelect
          placeholder="Filter by marks"
          data={likesValues}
          labelField="label"
          valueField="value"
          value={likesFilter}
          onChange={item => {
            setLikesFilter(item as LikedState[]);
          }}
        />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContent: {
    paddingHorizontal: 10,
  },
});

export default SideMenu;
