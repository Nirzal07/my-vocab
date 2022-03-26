// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FirebaseApp = initializeApp({
  apiKey: "AIzaSyASSLyR4NKjd7e8lRib4m5HN22TeDwxNSU",
  authDomain: "myvocab-31120.firebaseapp.com",
  projectId: "myvocab-31120",
  storageBucket: "myvocab-31120.appspot.com",
  messagingSenderId: "357890799787",
  appId: "1:357890799787:web:32bbb24e392e3e4850dfee",
  measurementId: "G-Y0BVYYBSJE"
})

// Initialize Firebase
const db = getFirestore(FirebaseApp);

export {db}
