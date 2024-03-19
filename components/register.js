import React, { useState } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text as RNText, Dimensions } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { Image } from 'react-native';

export default function App({ navigation }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
    const handleButtonPress = () => {
      console.log('login button pressed!');
    };
  
    const handleCreateAccountClick = () => {
      navigation.navigate('loginScreen');
    };

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    };
  
    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../assets/register.png')}
                style={styles.image}
              />
            </View>
            <RNText style={styles.text}>Welcome Aboard!</RNText>
    
            {/* Email TextInput */}
            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
              blurOnSubmit={true}
            />
    
            {/* Password TextInput */}
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              style={styles.textInput}
              right={<TextInput.Icon name={passwordVisible} icon = 'eye' onPress={togglePasswordVisibility} />}
            />
    
            {/* Confirm Password TextInput */}
            <TextInput
              label="Confirm Password"
              mode="outlined"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              style={styles.textInput}
              right={<TextInput.Icon name={confirmPasswordVisible} icon ='eye' onPress={toggleConfirmPasswordVisibility} />}
            />
    
            {/* Create account text */}
            <TouchableOpacity onPress={handleCreateAccountClick}>
              <RNText style={styles.clickHereText}>Already have an account?</RNText>
            </TouchableOpacity>
          </View>
    
          <View style={styles.buttonContainer}>
            <IconButton
              icon="arrow-right"
              iconColor={'#fff'}
              size={48}
              onPress={handleButtonPress}
              containerColor={'#0fa47a'}
            />
          </View>
    
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      );
    }
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flex: 1,
    width: '100%',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 256,
    height: 256,
  },
  text: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 31,
    textAlign: 'center',
    marginBottom: 10,
  },
  textInput: {
    marginBottom: 10,
    width: '89%',
  },
  createAccountText: {
    marginTop: 10,
    textAlign: 'center',
    
  },
  clickHereText: {
    color: '#0fa47a',
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 20,
  },
});
