import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

const BatchUploadScreen = ({ uploadedImages }) => {
  return (
    <View>
      <Text>Batch Upload Progress</Text>
      <ScrollView>
        {uploadedImages.map((image, index) => (
          <View key={index}>
            <Text>Image {index + 1}</Text>
            {/* Display progress bar for the image */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BatchUploadScreen;
