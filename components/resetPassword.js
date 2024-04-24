import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text as RNText, DefaultTheme } from 'react-native-paper';
import { API_URL } from "@env"
import { useAuth } from '../routes/AuthContext';

const ResetPassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userEmail } = useAuth();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#10A57B', // Green color used in Login component
      accent: '#10A57B', // Accent color (used for the focused state)
    },
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    if (oldPassword == newPassword)
    {
        Alert.alert('Error', 'New password and current password cannot match');
        return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL + '/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          email: userEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error);
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Password reset successful.');
      navigation.goBack(); // Navigate back to the previous screen after successful password reset
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.introContainer}>
          <RNText style={[styles.introText, {color: '#000'}]}>
            Please enter your current password, new password, and confirm your new password below.
          </RNText>
        </View>
        <TextInput
          label="Current Password"
          mode="outlined"
          secureTextEntry={!oldPasswordVisible}
          style={styles.input}
          value={oldPassword}
          onChangeText={setOldPassword}
          theme={theme}
          autoCapitalize="none"
          right={<TextInput.Icon icon={oldPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setOldPasswordVisible(!oldPasswordVisible)} />}
        />
        <TextInput
          label="New Password"
          mode="outlined"
          secureTextEntry={!passwordVisible}
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} />}
          theme={theme}
        />
        <TextInput
          label="Confirm New Password"
          mode="outlined"
          secureTextEntry={!confirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          style={styles.input}
          right={<TextInput.Icon icon={confirmPasswordVisible ? 'eye-off' : 'eye'} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />}
          theme={theme}
        />
        <Button
          mode="contained"
          style={styles.button}
          loading={loading}
          onPress={handleResetPassword}
          theme={theme}
        >
          Reset Password
        </Button>
        {/* Add some space at the bottom */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContainer: {
    marginBottom: 20,
  },
  introText: {
    fontSize: 18, // Increase the font size
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 20, // Add margin to the bottom of each input
  },
  button: {
    marginTop: 20, // Add margin to the top of the button
    width: '100%',
  },
});

export default ResetPassword;
