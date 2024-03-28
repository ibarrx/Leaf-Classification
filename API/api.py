from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase import firebase

firebase = firebase.FirebaseApplication('https://anomaleaf-d6feb-default-rtdb.firebaseio.com', None)
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    result = firebase.get('/Users', None)
    return str(result)

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
                users = []  # If users is None, initialize as an empty list


            new_user = {
                "UserEmail": user_email,
                "UserPassword": user_password
            }
            
            firebase.post('/Users', new_user)

            return jsonify({"message": "User created successfully."}), 201
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

            # Retrieve users data from Firebase
            users = firebase.get('/Users', None)

            if users is None:
                return jsonify({"error": "No users found."}), 404

            # Assuming users is a dictionary
            for user_id, user_data in users.items():
                if user_data.get("UserEmail") == user_email and user_data.get("UserPassword") == user_password:
                    return jsonify({"message": "User found.", "UserID": user_id}), 200

            # If no matching user is found
            return jsonify({"error": "Incorrect Username or Password."}), 401
    else:
        return jsonify({"error": "Method not allowed."}), 405

if __name__ == "__main__":
    app.run(debug=True, threaded=True, host="0.0.0.0", port=5000)
