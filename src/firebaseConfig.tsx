import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyAes7Dr-x2SpHyDvgN9GtDsVbtGKq7qIys",
    authDomain: "ecommerce-react-8999c.firebaseapp.com",
    databaseURL: "https://ecommerce-react-8999c-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "ecommerce-react-8999c",
    storageBucket: "ecommerce-react-8999c.appspot.com",
    messagingSenderId: "117585594453",
    appId: "1:117585594453:web:25853f30f2414e9cdaecdc"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { database, auth, storage};