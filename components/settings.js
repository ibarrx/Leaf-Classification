import React from 'react';
import { CommonActions  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { StyleSheet, View, Text as RNText, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';




const Tab = createBottomTabNavigator();

export default function MyComponent({navigation}) {
  return (
    
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="leaf" size={size} color={'#0fa47a'} />;
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="cog" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
  );
}

const HomeScreen = () => {
  navigator.navigate('Home');
};

function SettingsScreen() {
  return (
    <Text>Settings!</Text>
  );
}
