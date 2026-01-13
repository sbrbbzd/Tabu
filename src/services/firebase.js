import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAC1kpUuL7LGiRLVfzmG3HzPqvg9VfrjBY",
    authDomain: "taboo-sbrbbzd.firebaseapp.com",
    projectId: "taboo-sbrbbzd",
    storageBucket: "taboo-sbrbbzd.firebasestorage.app",
    messagingSenderId: "113481669297828225076",
    appId: "1:113481669297828225076:web:taboo"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export default app;
