import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'watch-store-dc53c.firebaseapp.com',
    projectId: 'watch-store-dc53c',
    storageBucket: 'watch-store-dc53c.appspot.com',
    messagingSenderId: '360569910208',
    appId: '1:360569910208:web:a2d566236d43caf8370e25',
};

export const app = initializeApp(firebaseConfig);
