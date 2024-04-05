import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import ActorDetailsScreen from '../screens/ActorDetailsScreen';
import {FilterProvider} from '../context/FilterContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const AppStack = () => {
  const Stack = createStackNavigator();
  return (
    <GestureHandlerRootView>
      <FilterProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="CelebritiesList" component={HomeScreen} />
            <Stack.Screen
              name="ActorDetails"
              component={ActorDetailsScreen}
              options={{
                headerTitle: '',
                headerBackTitleVisible: false,
                headerTintColor: 'black',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FilterProvider>
    </GestureHandlerRootView>
  );
};

export default AppStack;
