import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import startUp from '../components/startup';
import login from '../components/login';
import register from '../components/register';
import homePage from '../components/home';
import settingPage from '../components/settings';
import submissionPage from '../components/submissions';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="startUpScreen">
      <Stack.Screen name="startUpScreen" component={startUp} options={{headerShown: false}} />
      <Stack.Screen name="loginScreen" component={login} options={{headerShown: false}} />
      <Stack.Screen name="registerScreen" component={register} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={homePage} options={{ gestureDirection: 'horizontal' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
