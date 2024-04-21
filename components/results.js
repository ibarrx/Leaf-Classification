import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';

const Results = ({ route }) => {
  // Extract submission data from the route parameters
  const { anomalyStatus, captureDate, imageURL } = route.params;

  // Convert timestamp to a Date object
  const date = new Date(captureDate * 1000); // Multiply by 1000 to convert from seconds to milliseconds

  // Format the date as desired
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <Text style={styles.status}>{anomalyStatus}</Text>
      <Text style={styles.date}>Date:</Text>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-start', // Align content to the top
    paddingTop: 40, // Add padding to create space from the top
  },
  status: {
    fontSize: 30, // Make the status text bigger
    fontWeight: 'bold', // Make the status text bold
    marginBottom: 10, // Add margin between status and date
  },
  date: {
    fontSize: 20, // Make the date text bigger
  },
  image: {
    width: 300, // Make the image really big
    height: 300, // Make the image really big
    marginBottom: 20, // Add margin to create space between image and text
  },
});

export default Results;
