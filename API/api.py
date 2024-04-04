import base64
from io import BytesIO
from PIL import Image
import jwt
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase import firebase
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, timezone
import os
from werkzeug.utils import secure_filename
firebase = firebase.FirebaseApplication('https://anomaleaf-d6feb-default-rtdb.firebaseio.com', None)
app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
# Directory to save images
IMAGE_UPLOAD_FOLDER = '.\\images'

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

            users = firebase.get('/Users', None)

            if not users:
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
            
            firebase.post('/Users', new_user)

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
            users = firebase.get('/Users', None)

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
                return jsonify({"token": token, "id":user_data.get("UserEmail")}), 200
            else:
                return jsonify({"error": "Wrong email or password"}), 401
    else:
        return jsonify({"error": "Method not allowed."}), 405
    
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
    image_id = f"{userID}_{int(datetime.now().timestamp())}"
    image_path = os.path.join(IMAGE_UPLOAD_FOLDER, f"{image_id}.jpg")

    image.save(image_path)

    # Proceed to save image metadata in Firebase as before
    image_metadata = {
        "imageDirectory": image_path,
        "isAnomaly": False,
        "userID": request.form['userID']
    }
    firebase.post('/Images', image_metadata)
    return jsonify({"message": "Image uploaded successfully", "imageID": image_id}), 201
if __name__ == "__main__":
    app.run(debug=True, threaded=True, host="0.0.0.0", port=5000)
