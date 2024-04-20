import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-paper'; // Import Card from react-native-paper

export default function Submissions() {
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submissions, setSubmissions] = useState([]);

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
          userID: 'angelibarra8@gmail.com', // Replace with actual user ID
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
    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        {/* Display other information about the submission */}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.status}>{item.isAnomaly ? 'Anomaly Detected' : 'Normal'}</Text>
      </View>
    </Card>
  );
  
  
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
      {/* Custom Dropdown component */}
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
      {/* Submissions list */}
      <FlatList
        data={submissions}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40, // Half of the width and height to make it circular
    overflow: 'hidden', // Clip the image to the border radius
    marginRight: 16,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  documentation: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 15,
  },
  documentationText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 231,
    height: 36,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    marginTop: 14,
    marginLeft: 64,
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
