import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCPzIdmDWkzhm-jJNWySSTmyjNskpwuAp4',
  authDomain: 'vitos-grill.firebaseapp.com',
  projectId: 'vitos-grill',
  storageBucket: 'vitos-grill.appspot.com',
  messagingSenderId: '1048968422298',
  appId: '1:1048968422298:web:a0a1405a54d58ed0fdd023',
  measurementId: 'G-PQY7JKJCDV'
}
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
const storage = firebase.storage()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({
  login_hint: 'user@example.com'
})
export { auth, provider, storage }
export default db
