import React, { useContext, useState } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Menu, Divider, Provider } from 'react-native-paper';
import startUp from '../components/startup';
import login from '../components/login';
import register from '../components/register';
import homePage from '../components/home';
import settingPage from '../components/settings';
import aboutScreen from '../components/aboutScreen';
import submissionScreen from '../components/submissions';
import resultsScreen from '../components/results';
import resetPasswordScreen from '../components/resetPassword';
import batchScanScreen from '../components/batchUpload';
import AuthContext from './AuthContext';

const Stack = createNativeStackNavigator();

const LogoTitle = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
      <Image
        style={{ width: 35, height: 35, borderRadius: 17 }} // Making it circular
        source={require('../assets/icon.png')}
      />
    </TouchableOpacity>
  );
};

function MyStack() {
  const { userToken, signOut } = useContext(AuthContext);
  const [visibleHome, setVisibleHome] = useState(false);
  const [visibleSettings, setVisibleSettings] = useState(false);
  const [visibleSubmission, setVisibleSubmission] = useState(false);
  const [visibleResults, setVisibleResults] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const openMenu = (screen) => {
    switch (screen) {
      case 'home':
        setVisibleHome(true);
        setVisibleSettings(false);
        setVisibleSubmission(false);
        setVisibleResults(false);
        break;
      case 'settings':
        setVisibleHome(false);
        setVisibleSettings(true);
        setVisibleSubmission(false);
        setVisibleResults(false);
        break;
      case 'submission':
        setVisibleHome(false);
        setVisibleSettings(false);
        setVisibleSubmission(true);
        setVisibleResults(false);
        break;
      case 'results':
        setVisibleHome(false);
        setVisibleSettings(false);
        setVisibleSubmission(false);
        setVisibleResults(true);
        break;
      // Add cases for other screens as needed
      default:
        setVisibleHome(false);
        setVisibleSettings(false);
        setVisibleSubmission(false);
        setVisibleResults(false);
    }
  };

  const closeMenu = () => {
    setVisibleHome(false);
    setVisibleSettings(false);
    setVisibleSubmission(false);
    setVisibleResults(false);
    // Close other menus if needed
  };

  const openAbout = (navigation) => {
    closeMenu();
    navigation.navigate("About");
  };

  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          {userToken ? (
            <>
              <Stack.Screen
                name="Anomaleaf"
                component={homePage}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={visibleHome}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={() => openMenu('home')} />}
                    >                      
                      <Menu.Item onPress={() => openAbout(navigation)} title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />
              <Stack.Screen
                name="About"
                component={aboutScreen}
                options={{ headerShown: true }}
              />

              <Stack.Screen
                name="Settings"
                component={settingPage}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={visibleSettings}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={() => openMenu('settings')} />}
                    >
                      <Menu.Item onPress={closeMenu} title="Settings" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />

              <Stack.Screen
                name="Submission History"
                component={submissionScreen}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={visibleSubmission}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={() => openMenu('submission')} />}
                    >                      
                      <Menu.Item onPress={() => openAbout(navigation)} title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />

              <Stack.Screen
                name="Result"
                component={resultsScreen}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={visibleResults}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={() => openMenu('results')} />}
                    >                      
                      <Menu.Item onPress={() => openAbout(navigation)} title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />
              <Stack.Screen
                name="Reset Password"
                component={resetPasswordScreen}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={openMenu} />}
                    >                      
                      <Menu.Item onPress={() => openAbout(navigation)} title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />

              <Stack.Screen
                name="batchScan"
                component={batchScanScreen}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <Menu
                      visible={false}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={openMenu} />}
                    >                      
                      <Menu.Item onPress={() => openAbout(navigation)} title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                })}
              />
            </>
          ) : (
              <>
              <Stack.Screen
                name="startUpScreen"
                component={startUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="loginScreen"
                component={login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="registerScreen"
                component={register}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


export default MyStack;
