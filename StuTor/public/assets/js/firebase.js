// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTXOzk-Kr0BJ1OcRocHECvvSYOY86LIWo",
  authDomain: "stutor-codekridos.firebaseapp.com",
  projectId: "stutor-codekridos",
  storageBucket: "stutor-codekridos.appspot.com",
  messagingSenderId: "952917641380",
  appId: "1:952917641380:web:b44131d13fa9c8da88fe31",
  measurementId: "G-Q1JVTLFWV3"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
