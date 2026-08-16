import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

let auth = null;
if (firebaseEnabled) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export async function signUpWithEmail(email, password) {
  if (!auth) return null;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logInWithEmail(email, password) {
  if (!auth) return null;
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function subscribeToAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

export function signOutUser() {
  if (auth) signOut();
}

export { auth };
