# model_inference.py

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
class ModelInference:
    def __init__(self, model_path):
        self.model = load_model(model_path)

    def preprocess_image(self, image_path, target_size=(224, 224)):
        """
        Loads and preprocesses the image for model prediction, ensuring it's in RGB format
        and normalized to the [0, 1] range.
        """
        img = image.load_img(image_path, target_size=target_size, color_mode='rgb')
        img_array = image.img_to_array(img)
        img_array /= 255.0  # Normalize image array to [0, 1]
        img_array_expanded_dims = np.expand_dims(img_array, axis=0)
        return img_array_expanded_dims


    def predict(self, image_path):
        """
        Runs the model prediction on the given image and determines if it's an anomaly.
        """
        preprocessed_image = self.preprocess_image(image_path)
        prediction = self.model.predict(preprocessed_image)
        
        # Assuming the anomaly class index is known. Here, we're just checking if the highest predicted class
        # index is the anomaly. Adjust the condition based on your specific use case.
        print(np.argmax(prediction))
        isHealthy = np.argmax(prediction) == 9 # 9 happens to be the class index of a healthy leaf. Adjust this based on your model.
        is_anomaly = not isHealthy
        print ('is_anomaly:', bool(is_anomaly))
        return is_anomaly

# Example usage:
# model_inference = ModelInference('path/to/your/merged_model.h5')
# is_anomaly = model_inference.predict('path/to/the/image.jpg')
# print(f"Is anomaly: {is_anomaly}")
