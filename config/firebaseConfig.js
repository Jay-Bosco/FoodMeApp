// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC1Rz5ax2V59BLR4oWDBEC_vqL4wdHLEBc',
  authDomain: 'healthy-eating-app-4c66b.firebaseapp.com',
  projectId: 'healthy-eating-app-4c66b',
  storageBucket: 'healthy-eating-app-4c66b.appspot.com',
  messagingSenderId: '555291576562',
  appId: '1:555291576562:web:26d43fe480ba6abec9286b',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };