// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  orderBy,
  query,
  addDoc,
  where,
  updateDoc,
  limit,
  setDoc,
  startAfter,
  onSnapshot,
  startAt,
  endAt,
  Timestamp,
  runTransaction,
  writeBatch,
} from "firebase/firestore"
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth"

import {
  getStorage,
  ref,
  deleteObject,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID,
  REACT_APP_MEASUREMENT_ID,
} = process.env

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
const firestore = initializeApp(firebaseConfig)
const db = getFirestore()
export {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  orderBy,
  query,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  where,
  updateDoc,
  limit,
  setDoc,
  startAfter,
  onSnapshot,
  startAt,
  endAt,
  Timestamp,
  getStorage,
  ref,
  listAll,
  deleteObject,
  getDownloadURL,
  uploadBytes,
  runTransaction,
  writeBatch,
}
export default db
