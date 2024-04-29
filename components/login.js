import React, { useState, useContext, useRef } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Text as RNText, Image, Keyboard } from 'react-native';
import { TextInput, IconButton, DefaultTheme } from 'react-native-paper';
import { API_URL } from "@env"
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import AuthContext from '../routes/AuthContext';

function navigateToHome(navigation) {
  navigation.navigate('Home');
}

export default function Login({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#10A57B',
      accent: '#10A57B',   // Accent color (used for the focused state)
    },
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleButtonPress = async () => {
    if (password !== '' && email !== '') {
      try {
        setLoading(true); // Set loading to true when starting the request
        const response = await fetch(API_URL + '/login', {
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
          return;
        }

        const data = await response.json();
        signIn(data.token, email); // Set user token upon successful login
        navigateToHome(navigation); 
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    } else {
      Alert.alert('Password or email cannot be empty.');
    }
  };

  const handleCreateAccountClick = () => {
    navigation.navigate('registerScreen');
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
                source={require('../assets/login.png')}
                style={styles.image}
              />
            </View>
            <RNText style={styles.text}>Welcome back</RNText>


            <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.textInput]}
            blurOnSubmit={true}
            value={email}
            onChangeText={setEmail}
            ref={emailInputRef}
            theme={theme}
            textContentType={'oneTimeCode'}
          />

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />}
              theme={theme}
              textContentType={'oneTimeCode'}
            />

            <RNText style={styles.createAccountText}>
              Need an account?{' '}
              <TouchableOpacity onPress={handleCreateAccountClick}>
                <RNText style={styles.clickHereText}>Click here!</RNText>
              </TouchableOpacity>
            </RNText>
          </View>

          <View style={styles.buttonContainer}>
            <IconButton
              icon="arrow-right"
              iconColor={'#fff'}
              size={48}
              onPress={handleButtonPress}
              containerColor={'#10A57B'}
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
    marginBottom: -10,
  },
  image: {
    width: 380,
    height: 380,
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
    color: '#10A57B',
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
