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
  const [visible, setVisible] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const openAbout = ({navigation}) => {

       navigation.navigate("About");   
      
   
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          {userToken ? (
            <>
              <Stack.Screen
                name="Home"
                component={homePage}
                options={{
                  headerRight: () => (
                    <Menu
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={openMenu} />}
                    >                      
                      <Menu.Item onPress={openAbout } title="About" />
                      <Divider />
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                }}
              />


              <Stack.Screen
                name="Settings"
                component={settingPage}
                options={{
                  headerRight: () => (
                    <Menu
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={<LogoTitle onPress={openMenu} />}
                    >
                      <Menu.Item onPress={closeMenu} title="Settings" />
                      <Divider />
                      
                      <Menu.Item onPress={handleSignOut} title="Logout" />
                    </Menu>
                  ),
                }}
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

              <Stack.Screen
                name= "About"
                component={aboutScreen}
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
