import React, { useState, useContext } from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native';
import { StyleSheet, Text as RNText, Image } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import AuthContext from '../routes/AuthContext';

export default function Register({ navigation }) {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleButtonPress = async () => {
      if (confirmPassword === password) {
        try {
          console.log('Start loading...');
          setLoading(true); // Start loading indicator
          const response = await fetch('http://192.168.1.49:5000/signup', {
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
          signIn(data.token);
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error:', error);
          Alert.alert('Error', 'An error occurred. Please try again.');
          setLoading(false); // Stop loading indicator
          console.log('Stop loading (Error)');
        }
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
  
    return (
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
              onChangeText={setEmail}
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
              right={<TextInput.Icon  icon = 'eye' onPress={togglePasswordVisibility} />}
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
              right={<TextInput.Icon icon ='eye' onPress={toggleConfirmPasswordVisibility} />}
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
