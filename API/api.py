from flask import Flask, render_template, request, jsonify
from firebase import firebase
import os

firebase = firebase.FirebaseApplication('https://anomaleaf-d6feb-default-rtdb.firebaseio.com', None)
app = Flask(__name__)

@app.route("/")
def home():
    result = firebase.get('/Users', None)
    return str(result)

@app.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        if not request.form:
            return jsonify({"error": "No data provided."}), 400
        else:
            user_email = request.form.get("email")
            user_id = request.form.get("id")
            user_password = request.form.get("password")
            
            new_user = {
                "UserEmail": user_email,
                "UserID": user_id,
                "UserPassword": user_password
            }
            
            # Add new user to Firebase
            firebase.post('/Users', new_user)
    
            return jsonify({"message": "User created successfully."}), 201
    else:
        return jsonify({"error": "Method not allowed."}), 405

if __name__ == "__main__":
    app.run(debug=True)
