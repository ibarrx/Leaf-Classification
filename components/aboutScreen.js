
import React from 'react';
import { CommonActions  } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { StyleSheet, View, Text as RNText, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';


const AboutScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>About Screen...</Text>
      
    </View>
  );
};

export default AboutScreen;
