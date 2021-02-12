import app from 'firebase/app';
import 'firebase/database';
import { convertNodeToElement } from 'react-html-parser';

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

class Firebase {
  constructor() {
    console.dir(firebaseConfig);
    app.initializeApp(firebaseConfig);
    this.db = app.database();
  }

  user = address => this.db.ref(`users/${address}`)
  users = () => this.db.ref('users');

  project = projectID => this.db.ref(`projects/${projectID}`);
  projects = () => this.db.ref('projects');

  proposal = proposalID => this.db.ref(`proposals/${proposalID}`);
  proposals = () => this.db.ref('proposals');
}

export default Firebase;