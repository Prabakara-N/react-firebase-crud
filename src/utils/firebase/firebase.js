import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6O8RMVyCa9JleUh8qGkGSf46SFsiWaNg",
  authDomain: "react-crud-firebase-522a8.firebaseapp.com",
  projectId: "react-crud-firebase-522a8",
  storageBucket: "react-crud-firebase-522a8.appspot.com",
  messagingSenderId: "777051854513",
  appId: "1:777051854513:web:d28ae157c50ea31197f490",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
