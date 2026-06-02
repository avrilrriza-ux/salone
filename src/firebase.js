import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiqS2-yhl-ypHmnwusxqc_ZX1-OoaXJNM",
  authDomain: "salone-bad17.firebaseapp.com",
  projectId: "salone-bad17",
  storageBucket: "salone-bad17.appspot.com",
  messagingSenderId: "990695973987",
  appId: "1:990695973987:web:adce264aac80c44b680456",
  measurementId: "G-Q3JY5E3HSW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);       
export const db = getFirestore(app);   

export default app;