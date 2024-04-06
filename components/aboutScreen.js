import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the LinkedIn icon
import { Icon } from 'react-native-paper';

const AboutScreen = ({ navigation }) => {
  const groupMembers = [
    {
      name: 'Javier Miranda',
      title: 'Machine Learning Engineer',
      linkedin: 'https://www.linkedin.com/in/javier-miranda-tech/',
      photo: require('../assets/javier.jpg')
    },
    {
      name: 'Angel Ibarra',
      title: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/angel-ibarra-42bb33103/',
      photo: require('../assets/angel.jpg')
    },
    {
      name: 'Alexander Hitt',
      title: 'Machine Learning Engineer | Backend Developer',
      linkedin: 'https://www.linkedin.com/in/alexander-hitt-3a417253/',
      photo: require('../assets/alex.jpg')
    },
    {
      name: 'Cristian Espinoza',
      title: 'Machine Learning Engineer',
      linkedin: 'https://www.linkedin.com/in/cristian-alejandro-espinosa/',
      photo: require('../assets/cristian.jpg')
    },
    {
      name: 'Andrew Garza',
      title: 'Machine Learning Engineer | Frontend Developer',
      linkedin: 'https://www.linkedin.com/in/andrew-d-garza/',
      photo: require('../assets/andrew.jpg')
    }
  ];


  const openLinkedInProfile = (linkedin) => {
    Linking.openURL(linkedin);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Anomaleaf Team</Text>
      {groupMembers.map((member, index) => (
        <TouchableOpacity
          key={index}
          style={styles.memberContainer}
          onPress={() => openLinkedInProfile(member.linkedin)}
        >
          <Image source={member.photo} style={styles.photo} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.title}>{member.title}</Text>
          </View>
          <Text>          
          <Ionicons name="logo-linkedin" size={24} color="#0077B5" /> {/* LinkedIn icon */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  textContainer: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 16,
    color: 'gray'
  }
});

export default AboutScreen;
