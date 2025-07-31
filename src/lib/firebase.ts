// Import the functions you need from the SDKs you need
import {  initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzMYPNueFS-TwX3nPlWdfg3esNF2Ai6F4",
  authDomain: "nika-next-practice.firebaseapp.com",
  projectId: "nika-next-practice",
  storageBucket: "nika-next-practice.firebasestorage.app",
  messagingSenderId: "580567563340",
  appId: "1:580567563340:web:419c99601e1e56a92a88e9",
  measurementId: "G-RVYSP8KNLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
