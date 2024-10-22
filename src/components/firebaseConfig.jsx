// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDB5ylvp2gThVMABQa7vwUSlt8OyjPtSXo",
  authDomain: "softeng-b6119.firebaseapp.com",
  projectId: "softeng-b6119",
  storageBucket: "softeng-b6119.appspot.com",
  messagingSenderId: "522312495976",
  appId: "1:522312495976:web:e0f58be20b7f9405519cdd",
  measurementId: "G-8XVXBLPF88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
