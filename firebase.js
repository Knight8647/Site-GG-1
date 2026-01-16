// Import the functions you need from the SDKs you need
import { db } from './firebase.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwfFA1p-hQaxoLCcj_KMHbLnkg8cEbmVk",
  authDomain: "lista-casamento-8a103.firebaseapp.com",
  projectId: "lista-casamento-8a103",
  storageBucket: "lista-casamento-8a103.firebasestorage.app",
  messagingSenderId: "495368306305",
  appId: "1:495368306305:web:b914689e7513b2b352d780"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };