import base64
from io import BytesIO
from PIL import Image
import jwt
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from firebase import firebase
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, timezone
import os
from operator import itemgetter
from model_inference import ModelInference
import firebase_admin
from firebase_admin import credentials, db
from operator import itemgetter

cwd = os.getcwd()
# Initialize Firebase Admin SDK
key_path = os.path.join(cwd, 'API\\firebasekey.json')
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://anomaleaf-d6feb-default-rtdb.firebaseio.com/'  # Replace with your database URL
})
root = db.reference()


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
# Directory to save images
IMAGE_UPLOAD_FOLDER = os.path.join(cwd, "images")

print(os.getcwd())
model_inference = ModelInference('API\\rembg_training.h5')

# Ensure the image upload folder exists
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
# Secret key for JWT (keep it secure)
app.config['SECRET_KEY'] = '3fe988e252dbd290c6710248b58658d0ee9f2bb2b5803d411fdbda78cb8463fa'

@app.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        if not request.json:
            return jsonify({"error": "No data provided."}), 400
        else:
            user_email = request.json.get("email")
            user_password = request.json.get("password")

            users_ref = db.reference('Users')
            users = users_ref.get()

            if users is None:
                users = {}  # If users is None, initialize as an empty dictionary

            # Check if user already exists
            for user_data in users.values():
                if user_data.get("UserEmail") == user_email:
                    return jsonify({"error": "User already exists."}), 409

            # Hash the password
            hashed_password = bcrypt.generate_password_hash(user_password).decode('utf-8')

            # If user doesn't exist, create new user
            new_user = {
                "UserEmail": user_email,
                "UserPassword": hashed_password
            }

            # Push the new user data to Firebase
            new_user_ref = users_ref.push(new_user)
            new_user_key = new_user_ref.key

            # Generate JWT token for the new user
            token = jwt.encode({
                'user_id': user_email,
                'exp': datetime.now(timezone.utc) + timedelta(days=60)  # Token expiry in 60 days
            }, app.config['SECRET_KEY'])

            # Return the token in the response
            return jsonify({"token": token}), 201
    else:
        return jsonify({"error": "Method not allowed."}), 405

@app.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        if not request.json:
            return jsonify({"error": "No data provided."}), 400
        else:
            user_email = request.json.get("email")
            user_password = request.json.get("password")

            # Retrieve all users data from Firebase
            users_ref = db.reference('Users')
            users = users_ref.get()

            if users is None:
                return jsonify({"error": "No users found."}), 404

            # Check if the user with the provided email exists
            user_data = next((user_data for user_data in users.values() if user_data.get("UserEmail") == user_email), None)

            if user_data is None:
                return jsonify({"error": "Wrong email or password"}), 401

            # Verify the password
            if bcrypt.check_password_hash(user_data.get("UserPassword"), user_password):
                # Generate JWT token
                token = jwt.encode({
                    'user_id': user_data.get("UserEmail"),
                    'exp': datetime.now(timezone.utc) + timedelta(days=60)  # Token expiry in 60 days
                }, app.config['SECRET_KEY'])
                return jsonify({"token": token, "id": user_data.get("UserEmail")}), 200
            else:
                return jsonify({"error": "Wrong email or password"}), 401
    else:
        return jsonify({"error": "Method not allowed."}), 405

@app.route('/get_Submissions', methods=['POST'])
def get_Submissions():
    userID = request.json.get("userID")
    imageFilter = request.json.get("filterType")
    
    # Retrieve images from Firebase
    images_ref = root.child('Images')
    images = images_ref.order_by_child('userID').equal_to(userID).get()
    
    # Filter images based on filterType
    if imageFilter == '':   # Sort by date most recent to oldest
        sorted_images = sorted(images.values(), key=lambda x: x['timestamp'], reverse=True)
    elif imageFilter == '1':  # Sort by date most recent to oldest
        sorted_images = sorted(images.values(), key=lambda x: x['timestamp'], reverse=True)
    elif imageFilter == '2':  # Sort by oldest to newest
        sorted_images = sorted(images.values(), key=lambda x: x['timestamp'])
    elif imageFilter == '3':  # Sort by isAnomaly by date most recent
        sorted_images = sorted(images.values(), key=itemgetter('isAnomaly', 'timestamp'), reverse=True)
    elif imageFilter == '4':  # Filter isAnomaly = false by date most recent
        sorted_images = [img for img in images.values() if not img['isAnomaly']]
        sorted_images.sort(key=lambda x: x['timestamp'], reverse=True)
    else:
        return jsonify({"error": "Invalid filter type"}), 400

    # Retrieve image data for sorted images
    image_urls = []
    for img in sorted_images:
        image_path = img.get('imageDirectory')  # Assuming 'imageDirectory' holds the image file path
        if image_path:
            # Normalize the image path to remove redundant components like the dot
            normalized_path = os.path.normpath(image_path)
            # Construct the URL for the image
            image_url = f"http://{request.host}/{normalized_path.replace(os.sep, '/')}"
            image_urls.append(image_url)

    return jsonify({"image_urls": image_urls}), 200


@app.route('/images/<path:image_filename>')
def get_image(image_filename):
    # Construct the path to the image file
    image_path = os.path.join(IMAGE_UPLOAD_FOLDER, image_filename)
    
    # Check if the image file exists
    if os.path.isfile(image_path):
        # Send the image file as a response
        return send_file(image_path, mimetype='image/jpeg')  # Adjust mimetype based on image type
    else:
        return jsonify({"error": "Image not found"}), 404

@app.route('/upload_image', methods=['POST'])
def upload_image():
    # This assumes you've received the base64 encoded data in `imageBase64` field.
    if 'imageBase64' not in request.form:
        return jsonify({"error": "No image data"}), 400

    image_data = request.form['imageBase64']
    image_data = image_data[image_data.find(",")+1:]  # Strip the base64 prefix if present
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))

    userID = request.form['userID']
    timestamp = datetime.now().timestamp()  # Get the current timestamp
    image_id = f"{userID}_{int(timestamp)}"
    image_path = os.path.join(IMAGE_UPLOAD_FOLDER, f"{image_id}.jpg")

    image.save(image_path)

    # Proceed to save image metadata in Firebase as before
    image_metadata = {
        "imageDirectory": image_path,
        "isAnomaly": False,
        "userID": request.form['userID'],
        "timestamp": timestamp  # Include the timestamp in metadata
    }

    #TODO: run inference on the image and figure out if it's an anomaly or not
    is_anomaly = model_inference.predict(image_path)
    image_metadata["isAnomaly"] = bool(is_anomaly)
    
    # Save the image metadata in Firebase
    images_ref = db.reference('Images')
    images_ref.push(image_metadata)
    
    return jsonify({"message": "Image uploaded successfully", 
                    "imageID": image_id, 
                    "isAnomaly": image_metadata["isAnomaly"]}), 201


if __name__ == "__main__":
    app.run(debug=True, threaded=True, host="0.0.0.0", port=5000)
