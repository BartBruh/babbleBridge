import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWTJADODSdfaG_deX0c0g3fa1g0ndUdR8",
  authDomain: "glotsync.firebaseapp.com",
  projectId: "glotsync",
  storageBucket: "glotsync.appspot.com",
  messagingSenderId: "448980874547",
  appId: "1:448980874547:web:5d972c5eadacc6cfbffa46",
  measurementId: "G-TH8VQPGHT3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
const analytics = getAnalytics(app);