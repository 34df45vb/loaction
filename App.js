import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SetLocation from './pages/SetLocation';
import LocationList from './pages/LocationList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={() => <SetLocation />} options={{ headerShown: false }} />
        <Stack.Screen name="Location List" component={() => <LocationList />} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
