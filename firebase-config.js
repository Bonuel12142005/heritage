// Firebase Configuration for HeritageLink
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZGpd0PHq7I7uAptuqSEcIPyD3hUvscsc",
  authDomain: "heritagelink-22d0f.firebaseapp.com",
  projectId: "heritagelink-22d0f",
  storageBucket: "heritagelink-22d0f.firebasestorage.app",
  messagingSenderId: "84963404702",
  appId: "1:84963404702:web:555723af69e23b8b23848f",
  measurementId: "G-MK0MB2KXEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };