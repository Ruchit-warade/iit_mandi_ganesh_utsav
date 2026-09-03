/**
 * Firebase Configuration
 * Replace placeholder values with your actual Firebase project config
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBsZe5SWASl9vuBNV3W3WlTHpw5w6HL4qs",
  authDomain: "ganeshutsavdonation.firebaseapp.com",
  projectId: "ganeshutsavdonation",
  storageBucket: "ganeshutsavdonation.firebasestorage.app",
  messagingSenderId: "131944288366",
  appId: "1:131944288366:web:1c6d75679b5538832ed67f"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
