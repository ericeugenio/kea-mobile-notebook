import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdT5-DtGVKmxgTSSviK7vQRbYvPcU4Fj4",
  authDomain: "notebook-kea.firebaseapp.com",
  projectId: "notebook-kea",
  storageBucket: "notebook-kea.appspot.com",
  messagingSenderId: "635798400158",
  appId: "1:635798400158:web:279c49eb5a5869720b9f8f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default { app, db }
