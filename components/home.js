import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card, Title, Text } from 'react-native-paper';
import { View, ScrollView, TouchableOpacity, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { useAuth } from '../routes/AuthContext';


const Tab = createBottomTabNavigator();

const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status;
};

export default function MyComponent({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
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
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const { userToken, userEmail } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const uploadImage = async (uri, base64Data) => {
    setLoading(true); // Set loading to true when starting the request

    let formData = new FormData();
    formData.append('userID', userEmail);

    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileType = uri.split('.').pop();

    formData.append('image', {
      uri: uri,
      name: `upload.${fileType}`,
      type: `image/${fileType}`,
    });

    formData.append('imageBase64', base64Data);

    try {
      const response = await fetch('http://192.168.1.77:5000/upload_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      alert(data.isAnomaly ? 'Anomaly detected!' : 'No anomaly detected.');

    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  
    if (!result.canceled) {
      setImage(result.uri);
      uploadImage(result.uri, result.base64); // Call upload function after image is set
    }
  };
  
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  
    if (!result.canceled) {
      setImage(result.uri);
      console.log(result);
      uploadImage(result.uri, result.base64); // Call upload function after image is set
    }
  };
  

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to media library</Text>;
  }

  return (
    <>
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
        <TouchableOpacity style={[styles.scanCard, styles.newScan]} onPress={takePicture}>
          <Icon name="camera" size={64} />
          <Text style={styles.buttonText}>New Scan</Text>
        </TouchableOpacity>
        <View style={styles.scanOptions}>
          <TouchableOpacity style={styles.scanOptionCard} onPress={selectImage}>
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
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator animating={true} size="large" color="#0fa47a" style={{ transform: [{ scale: 2 }] }} />
            </View>
          )}
          </>
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
  newScan: {
    width: '100%',
  },
  buttonText: {
    marginTop: 8,
  },
  submissionTitle: {
    marginBottom: 16,
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
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
