// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdM5YXG1Ap_wnJNkVlyGPGaKZU5GRXjjQ",
  authDomain: "web-apps-732ac.firebaseapp.com",
  projectId: "web-apps-732ac",
  storageBucket: "web-apps-732ac.firebasestorage.app",
  messagingSenderId: "486997669923",
  appId: "1:486997669923:web:86a29df0d5073a740f9996",
  measurementId: "G-JSCMW2F7NN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
