import 'react-native-gesture-handler';
import React from 'react';
<<<<<<< HEAD
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text as RNText, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
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

  const handleHelpPress = () => {
    // Navigate to the help page
    console.log('Help pressed');
    // Implement navigation logic here
  };

  return (
    <View style={styles.startUp}>
      <Text>Leaf anomaly detection made easy.</Text>
      
      <Button onPress={handleButtonPress} mode="contained"
      style={styles.getStartedButton}
      labelStyle={{color: '#0fa47a', fontSize: 22}}>

        Get Started
      </Button>

      {/* Help hyperlink */}
      <TouchableOpacity onPress={handleHelpPress}>
        <Text style={styles.helpText}>Help</Text>
      </TouchableOpacity>
      
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
  helpText: {
    marginTop: 20,
    color: '#ffffff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

=======
import {AppLoading} from 'expo';
import Navigator from './routes/homeStack'

export default function App(){
  return (<Navigator/>);
}
>>>>>>> 3385bf6a8bd5be0bf7b4f46ce0b84b8eff59cd2e
