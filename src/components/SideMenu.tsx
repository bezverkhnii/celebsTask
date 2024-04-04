import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {MultiSelect} from 'react-native-element-dropdown';
import {FilterContext} from '../context/FilterContext';

const SideMenu = ({isOpen}) => {
  const {departmentTypes, departmentFilter, setDepartmentFilter} =
    useContext(FilterContext);

  /////
  const departmentValues = departmentTypes.map(type => ({
    label: type,
    value: type,
  }));
  /////
  const menuWidth = useSharedValue(0);
  useEffect(() => {
    if (!isOpen) {
      menuWidth.value = withTiming(0);
    } else {
      menuWidth.value = withTiming(250);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: menuWidth.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.menuContent}>
        <MultiSelect
          placeholder="Filter by department"
          data={departmentValues}
          //@ts-ignore
          labelField="label"
          //@ts-ignore
          valueField="value"
          value={departmentFilter}
          onChange={item => {
            setDepartmentFilter(item);
            console.log(departmentFilter);
          }}
        />
        <MultiSelect
          placeholder="Filter by department"
          data={departmentValues}
          //@ts-ignore
          labelField="label"
          //@ts-ignore
          valueField="value"
          value={departmentFilter}
          onChange={item => {
            setDepartmentFilter(item);
            console.log(departmentFilter);
          }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0, // Positioning on the right side
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
  closeButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContent: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
});

export default SideMenu;
