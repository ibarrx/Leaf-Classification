import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useAuth } from '../routes/AuthContext';

export default function Submissions({ navigation }) {
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const { userToken, userEmail } = useAuth();

  const filter = [
    { key: '1', value: 'By Date Desc' },
    { key: '2', value: 'By Date Asc' },
    { key: '3', value: 'Is Anomaly' },
    { key: '4', value: 'Not an Anomaly' },
  ];

  useEffect(() => {
    fetchSubmissions();
  }, [selected]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://10.0.0.4:5000/get_Submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userEmail,
          filterType: selected,
        }),
      });
      const data = await response.json();
      setSubmissions(data.images);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Result', {
      anomalyStatus: item.isAnomaly ? 'Anomaly Detected' : 'Normal Leaf',
      captureDate: item.captureDate, imageURL: item.url
    })} style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.url }} style={styles.image} />
          {!item.url && <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />}
        </View>
        <View style={styles.textContainer}>
        <Text style={styles.title}>{getStatus(item.isAnomaly)}</Text>
        </View>
        <AntDesign name="right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );

  const getStatus = (isAnomaly) => {
    if (isAnomaly) {
      return 'Anomaly Detected';
    } else {
      const responses = ['Normal 😊', 'All good here 🍃', 'No anomalies found 🥳', 'Leaf is healthy 🌱'];
      // Generate a random index to pick a response from the array
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }
  };

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        setSelected(item.key);
        setModalVisible(false);
      }}
    >
      <Text>{item.value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownContainer}>
        <Text style={styles.dropdownText}>{selected ? filter.find(item => item.key === selected)?.value : 'Filter by'}</Text>
        <AntDesign name="down" size={16} color="#000" style={styles.dropdownIcon} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={filter}
              renderItem={renderDropdownItem}
              keyExtractor={item => item.key}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <FlatList
        data={submissions}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items horizontally with space between them
    flex: 1, // Allow the right icon to be pushed to the far right
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: 'red',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    width: 231,
    height: 36,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginTop: 14,
    marginLeft: 'auto', // Use marginLeft: 'auto' to push it to the right
    marginRight: 'auto', // Use marginRight: 'auto' to push it to the left
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 2,
    elevation: 2,
  },
  
  dropdownText: {
    fontSize: 14,
    color: '#000',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
