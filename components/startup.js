import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Button } from 'react-native-paper';
import { Image } from 'react-native';

const Text = (props) => {
  return (
    <RNText style={[styles.text, props.style]}>
      {props.children}
    </RNText>
  );
};

export default function App( { navigation}) {
  const handleButtonPress = () => {
    navigation.navigate('loginScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/anomaleafLogo.png')}
            style={styles.image}
          />
        </View>
        <Text>Leaf anomaly detection made easy.</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button onPress={handleButtonPress} mode="contained"
          style={styles.getStartedButton}
          labelStyle={{color: '#0fa47a', fontSize:21}}>
          Get Started
        </Button>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10A57B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: -20,
  },
  image: {
    width: 320,
    height: 240,
  },
  buttonContainer: {
    marginBottom: 36,
    alignItems: 'center',
    width: '94%',
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
