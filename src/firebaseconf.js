import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Adicionamos isso
import { getFirestore } from "firebase/firestore"; // Adicionamos isso


const firebaseConfig = {
  apiKey: "AIzaSyClPZVI-jv-5ikBch_2YmjJtYbHELvk2r8",
  authDomain: "maritia-8ab46.firebaseapp.com",
  projectId: "maritia-8ab46",
  storageBucket: "maritia-8ab46.firebasestorage.app",
  messagingSenderId: "20215769172",
  appId: "1:20215769172:web:5cbe189d314540d76265c1",
  measurementId: "G-F639Z3EH4J"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// EXPORTA AS FERRAMENTAS (Essas linhas são o segredo!)
export const auth = getAuth(app);
export const db = getFirestore(app);