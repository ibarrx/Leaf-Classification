import React from 'react';
import { createAppContainer } from '@react-navigation/stack';
import { createStackNavigator } from '@react-navigation/stack';
import startUp from './components/startup';
import homePage from './components/home';
import registerLogin from './components/register';
import settingPage from './components/settings';
import submissionPage from './components/submissions'

const screens = 
{
  startUp:
  {
    screen: startUp
  },
  homePage:
  {
    screen: homePage
  },
  registerLogin:
  {
    screen: registerLogin
  },
  settingPage:
  {
    screen: settingPage
  },
  submissionPage:
  {
    screen: submissionPage
  }

}

const homeStack = createAppContainer(screens);
export default createAppContainer(homeStack);