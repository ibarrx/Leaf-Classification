import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, Text as RNText, Dimensions } from 'react-native';


const Tab = createBottomTabNavigator();

function SubmissionSection() {
  return (
    <View style={styles.submissionSection}>
      <Text style={styles.sectionTitle}>View Submissions</Text>
      <View style={styles.submissionButtons}>
        <TouchableOpacity style={styles.submissionButton}>
          <Icon name="history" size={24} />
          <Text>Submission History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submissionButton}>
          <Icon name="settings-outline" size={24} />
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NewSubmissionSection() {
  return (
    <View style={styles.newSubmissionSection}>
      <Text style={styles.sectionTitle}>New submission</Text>
      <View style={styles.submissionButtons}>
        <TouchableOpacity style={styles.submissionButton}>
          <Icon name="camera" size={24} />
          <Text>New Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submissionButton}>
          <Icon name="upload" size={24} />
          <Text>Upload Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submissionButton}>
          <Icon name="view-grid-plus" size={24} />
          <Text>Batch Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyComponent({navigation}) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="leaf" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => {
              return <Icon name="cog" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  return (
    <Text>Home!</Text>
  );
}

function SettingsScreen() {
  return (
    <Text>Settings!</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  submissionSection: {
    marginBottom: 20,
  },
  newSubmissionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submissionButton: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  }
});