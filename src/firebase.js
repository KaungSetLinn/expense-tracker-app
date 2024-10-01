// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfMOKaODRbQua-qM9l0TlP2ujEvfWaM3o",
  authDomain: "expense-tracker-e5bab.firebaseapp.com",
  projectId: "expense-tracker-e5bab",
  storageBucket: "expense-tracker-e5bab.appspot.com",
  messagingSenderId: "780704570851",
  appId: "1:780704570851:web:80085bf85b10c7bdaa54d6",
  measurementId: "G-XELYCE4RFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
/* provider.setCustomParameters({   
  prompt : "select_account "
}); */

export const auth = getAuth(app);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);