import React, { useState, useContext, useRef } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text as RNText, Image, Keyboard } from 'react-native';
import { TextInput, IconButton, DefaultTheme } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { API_URL } from "@env"
import AuthContext from '../routes/AuthContext';

export default function Register({ navigation }) {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true); // state to track email validation
    const emailInputRef = useRef(null);
    const theme = {
      ...DefaultTheme,
      roundness: 2,
      colors: {
        ...DefaultTheme.colors,
        primary: '#10A57B',
        accent: '#10A57B',
      },
    };

    const handleButtonPress = async () => {
      if (confirmPassword === password && isValidEmail) { // Check for valid email format
        try {
          console.log('Start loading...');
          setLoading(true); // Start loading indicator
          const response = await fetch(API_URL + '/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            Alert.alert('Error', errorData.error);
            setLoading(false); // Stop loading indicator
            console.log('Stop loading (Error)');
            return;
          }
    
          console.log('Stop loading (Success)');
          const data = await response.json();
          signIn(data.token, email);
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error:', error);
          Alert.alert('Error', 'An error occurred. Please try again.');
          setLoading(false); // Stop loading indicator
          console.log('Stop loading (Error)');
        }
      } else if (!isValidEmail) {
        Alert.alert('Please enter a valid email address.');
      } else {
        Alert.alert('Passwords do not match.');
      }
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

    const handleEmailChange = (text) => {
      setEmail(text); // Update the email state

      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(text); // Test if the input matches the email format

      setIsValidEmail(isValid); // Update the isValidEmail state
    };

    const dismissKeyboard = () => {
      Keyboard.dismiss();
      emailInputRef.current.blur();
    };
  
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <KeyboardAvoidingView 
            style={styles.content}
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
                value={email}
                onChangeText={handleEmailChange} // Use the custom handler for email validation
                error={!isValidEmail} // Apply error style if email is not valid
                ref={emailInputRef}
                theme={theme}
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
                right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />}
                theme={theme}
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
                right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />}
                theme={theme}
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
          </KeyboardAvoidingView>
  
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator animating = {true} size="large" color="#0fa47a" style={{ transform: [{ scale: 2 }] }}/>
            </View>
          )}
  
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});
