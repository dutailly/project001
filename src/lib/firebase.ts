import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD-rGKE6C4zN67KnjQlRTb4qxPOacU-gK4",
  authDomain: "mypins-70e3f.firebaseapp.com",
  projectId: "mypins-70e3f",
  storageBucket: "mypins-70e3f.firebasestorage.app",
  messagingSenderId: "896934319297",
  appId: "1:896934319297:web:0d475345cb9a528b39f040",
  measurementId: "G-4XBZGCT5KZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();