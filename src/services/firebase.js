import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDklqFqpcLahirdvM6R99tXBzEmXekshUA",
  authDomain: "odop-connect.firebaseapp.com",
  projectId: "odop-connect",
  storageBucket: "odop-connect.firebasestorage.app",
  messagingSenderId: "342937680354",
  appId: "1:342937680354:web:3f0090d293b4c5b5f061bb",
  measurementId: "G-0P9BHH1B28"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
