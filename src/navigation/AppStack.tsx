import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ActorDetailsScreen from '../screens/ActorDetailsScreen';

const AppStack = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CelebritiesList" component={HomeScreen} />
        <Stack.Screen name="ActorDetails" component={ActorDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
