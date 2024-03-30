import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card, Title, Text } from 'react-native-paper';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MyComponent({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="leaf" size={size} color={'#0fa47a'} />;
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
  );
}

const HomeScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.section}>
        <Title>View Submissions</Title>
        <Card style={[styles.card, { marginTop:24, marginBottom: 24 }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardRow}>
              <Icon name="history" size={24} />
              <Title style={styles.cardTitle}>Submission History</Title>
            </View>
            <TouchableOpacity onPress={() => console.log('View button pressed')} style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>

      <View style={[styles.section, { marginTop: 24 }]}>
        <Title style={styles.submissionTitle}>New Submission</Title>
        <TouchableOpacity style={styles.scanCard}>
          <Icon name="camera" size={64} />
          <Text style={styles.buttonText}>New Scan</Text>
        </TouchableOpacity>
        <View style={styles.scanOptions}>
          <TouchableOpacity style={styles.scanOptionCard}>
            <Icon name="upload" size={48} />
            <Text style={styles.buttonText}>Upload Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanOptionCard}>
            <Icon name="view-grid-plus" size={48} />
            <Text style={styles.buttonText}>Batch Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

function SettingsScreen() {
  return (
    <Text>Settings!</Text>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  card: {
    borderRadius: 24,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    marginLeft: 8,
  },
  viewButton: {
    backgroundColor: '#0fa47a',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  scanCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
  },
  buttonText: {
    marginTop: 8,
  },
  scanOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanOptionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    width: '48%', // Adjust as needed
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submissionTitle: {
    marginBottom: 16,
  },
});
