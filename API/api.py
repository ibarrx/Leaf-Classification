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


            if isinstance(users, list) and len(users) > 0:
                # Filter out 'None' values from the list and extract user dictionaries
                user_dicts = [user for user in users if user]
                if user_dicts:
                    # Filter out user dictionaries with invalid UserID format
                    valid_user_dicts = [user for user in user_dicts if "UserID" in user and user["UserID"].startswith("user")]
                    if valid_user_dicts:
                        latest_user = max(valid_user_dicts, key=lambda x: int(x["UserID"].split("user")[1]))
                        latest_user_id = int(latest_user["UserID"].split("user")[1])
                        user_id = "user" + str(latest_user_id + 1)
                    else:
                        user_id = "user1"  # Default user_id if no valid users exist
                else:
                    user_id = "user1"  # Default user_id if no valid users exist
            else:
                user_id = "user1"  # Default user_id if no users exist

            new_user = {
                "UserEmail": user_email,
                "UserID": user_id,
                "UserPassword": user_password
            }

            # Use the put method to specify the exact location to store the data
            firebase.put('/Users', user_id, new_user)

            return jsonify({"message": "User created successfully.", "UserID": user_id}), 201
    else:
        return jsonify({"error": "Method not allowed."}), 405


@app.route("/login", methods=["GET"])
def login():
    if request.method == "GET":
        if not request.args:
            return jsonify({"error": "No data provided."}), 400
        else:
            user_email = request.args.get("email")
            user_password = request.args.get("password")

            # Use the get method to retrieve the user data from Firebase
            users = firebase.get('/Users', None)

            # Check if users data is None or empty
            if users is None:
                return jsonify({"error": "No users found."}), 404

            if isinstance(users, list):
                for user_data in users:
                    if user_data and user_data.get("UserEmail") == user_email and user_data.get("UserPassword") == user_password:
                        return jsonify({"message": "User found.", "UserID": user_data["UserID"]}), 200
                return jsonify({"error": "Incorrect Username or Password."}), 401

            # If no matching user is found
            return jsonify({"error": "Incorrect Username or Password."}), 401
    else:
        return jsonify({"error": "Method not allowed."}), 405

if __name__ == "__main__":
    app.run(debug=True)
