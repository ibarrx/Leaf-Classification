import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Button } from 'react-native-paper';
import { Image } from 'react-native-paper';

const Text = (props) => {
  return (
    <RNText style={[styles.text, props.style]}>
      {props.children}
    </RNText>
  );
};

export default function App() {
  const handleButtonPress = () => {
    // Your button press logic here
    console.log('Button pressed');
  };

  return (
    <View style={styles.startUp}>
      <Text>Leaf anomaly detection made easy.</Text>
      
      <Button onPress={handleButtonPress} mode="contained"
      style={styles.getStartedButton}
      labelStyle={{color: '#0fa47a', fontSize:'21'}}>

        Get Started
      </Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  startUp: {
    flex: 1,

    backgroundColor: '#0fa47a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    width: '89%',
    color:"#0fa47a",
    height: 50,
    display: 'flex',
    justifyContent: 'center'
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 31,
    textAlign: 'center',
  },
});
