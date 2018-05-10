import * as firebase from "firebase";
import {
  FIREBASE_DATABASEURL,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_APIKEY,
  FIREBASE_STORAGEBUCKET
} from "react-native-dotenv";

const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  databaseURL: FIREBASE_DATABASEURL,
  storageBucket: FIREBASE_STORAGEBUCKET
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
