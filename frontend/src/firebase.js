// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3hoKR1M-nBKfgT4nqevDwDJAd3Rg6CzI",
  authDomain: "medishare11.firebaseapp.com",
  projectId: "medishare11",
  storageBucket: "medishare11.appspot.com",
  messagingSenderId: "614009620416",
  appId: "1:614009620416:web:28f9da540eb2ada53a2a25",
  measurementId: "G-147PE6GRFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
