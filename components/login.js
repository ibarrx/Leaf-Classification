import React, { useState } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { StyleSheet, View, Text as RNText, Dimensions, Alert } from 'react-native';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';


function navigateToHome(navigation) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'Home' },
      ],
    })
  );
}

export default function App({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
        };

        const handleButtonPress = async () => {
          if (password !== '' && email !== '') {
            try {
              const response = await fetch('http://192.168.1.49:5000/login', {
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
              navigateToHome(navigation);
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'An error occurred. Please try again.');
            }
          } else {
            Alert.alert('Password or email cannot be empty.');
          }
        };
        


  const handleCreateAccountClick = () => {
    navigation.navigate('registerScreen');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
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
              onChangeText={setEmail}
            />

        {/* Password TextInput */}
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          style={styles.textInput}
          value={password} // Add this line
          onChangeText={setPassword} // And this one
          right={<TextInput.Icon name={passwordVisible } icon='eye' onPress={togglePasswordVisibility} />}
          />



        {/* Create account text */}
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
