import React from 'react';
import { createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import startUp from '../components/startup';
import homePage from '../components/home';
import registerLogin from '../components/register';
import settingPage from '../components/settings';
import submissionPage from '../components/submissions'

const screens = createSwitchNavigator(
{
  startUpScreen: startUp,
  // homePageScreen: homePage,
  // registerLoginScreen: registerLogin,
  // settingPageScreen: settingPage,
  // submissionPageScreen: submissionPage
},
{
  initialRouteName: 'startUpScreen',
}
);

//const homeStack = createAppContainer(screens);
export default createAppContainer(screens);