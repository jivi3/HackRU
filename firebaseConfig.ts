// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { getReactNativePersistence } from "firebase/auth/"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvKtOBbLcFpG5HshLGmmqNkq80jlJ9yAY",
  authDomain: "fairshare-2ab9a.firebaseapp.com",
  projectId: "fairshare-2ab9a",
  storageBucket: "fairshare-2ab9a.appspot.com",
  messagingSenderId: "748280510650",
  appId: "1:748280510650:web:dbd210a16e919ff6936a83",
  measurementId: "G-6PWGT1ECGX",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const analytics = getAnalytics(FIREBASE_APP);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIRESTORE = getFirestore(FIREBASE_APP);
