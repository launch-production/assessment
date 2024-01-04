// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7jZNwP3ux8aSYkNyPGQrJVxxEzWysv84",
  authDomain: "vis-assessment.firebaseapp.com",
  projectId: "vis-assessment",
  storageBucket: "vis-assessment.appspot.com",
  messagingSenderId: "877168969169",
  appId: "1:877168969169:web:cb588b36332a010d9a0cf0",
  measurementId: "G-HV1PLSRFGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};
