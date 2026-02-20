import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Update display name
  await updateProfile(user, { displayName });

  // Create user doc in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName,
    photoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    settings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      defaultPlatforms: [],
    },
  });

  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  // Check if user doc exists, create if not
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      settings: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        defaultPlatforms: [],
      },
    });
  }

  return user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
