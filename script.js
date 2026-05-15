// ===============================
// FIREBASE
// ===============================

const firebaseConfig = {

  apiKey: "AIzaSyDro83v9wZNYfY9N5NzrJH4eKrfDo1cVeM",

  authDomain: "maquina-rifas-new.firebaseapp.com",

  databaseURL: "https://maquina-rifas-new-default-rtdb.firebaseio.com",

  projectId: "maquina-rifas-new",

  storageBucket: "maquina-rifas-new.firebasestorage.app",

  messagingSenderId: "14102154747",

  appId: "1:14102154747:web:6ef2e73ec068a062aacf5e",

  measurementId: "G-64E3WC679C"

};

// Inicializar Firebase

firebase.initializeApp(firebaseConfig);

// Firestore

const db = firebase.firestore();

// Storage

const storage = firebase.storage();

console.log("🔥 Firebase conectado");
