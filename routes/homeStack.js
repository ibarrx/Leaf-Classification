import React from 'react';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import startUp from '../components/startup';
import login from '../components/login';
import register from '../components/register';
import homePage from '../components/home';
import settingPage from '../components/settings';
import submissionPage from '../components/submissions'

const screens = createSwitchNavigator(
{
  startUpScreen: startUp,
  loginScreen: login,
  registerScreen: register,
  homeScreen: homePage,
  // settingPageScreen: settingPage,
  // submissionPageScreen: submissionPage
},
{
  initialRouteName: 'startUpScreen',
}
);

//const homeStack = createAppContainer(screens);
export default createAppContainer(screens);