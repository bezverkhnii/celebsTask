import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import ActorDetailsScreen from '../screens/ActorDetailsScreen';
import {Button} from 'react-native';
import {FilterProvider} from '../context/FilterContext';

const AppStack = () => {
  const Stack = createStackNavigator();
  return (
    <FilterProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="CelebritiesList" component={HomeScreen} />
          <Stack.Screen
            name="ActorDetails"
            component={ActorDetailsScreen}
            options={{
              headerTitle: '',
              headerBackTitle: '',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FilterProvider>
  );
};

export default AppStack;
