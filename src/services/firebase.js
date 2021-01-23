import firebase from 'firebase'

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
}
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
const provider = new firebase.auth.OAuthProvider('microsoft.com')
export { auth, provider, storage }
export default db
