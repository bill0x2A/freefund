import app from 'firebase/app';
import 'firebase/database';

var firebaseConfig = {
  apiKey: "AIzaSyCac17VNHOFpqFbfzCyIwLvI1rW7vLd-po",
  authDomain: "freefund-74f0f.firebaseapp.com",
  databaseURL: "https://freefund-74f0f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "freefund-74f0f",
  storageBucket: "freefund-74f0f.appspot.com",
  messagingSenderId: "338112204878",
  appId: "1:338112204878:web:eb467eb1546d5a3d1e331f"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.database();
  }

  user = address => this.db.ref(`users/${address}`)
  users = () => this.db.ref('users');

  project = projectID => this.db.ref(`projects/${projectID}`);
  projects = () => this.db.ref('projects');

}

export default Firebase;