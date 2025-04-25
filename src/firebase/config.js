import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  fetchSignInMethodsForEmail,
  updatePassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Error handling utility
const handleAuthError = (error) => {
  console.error("Auth error:", error);

  const errorMap = {
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "Account disabled",
    "auth/user-not-found": "No account found",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "Email already registered",
    "auth/operation-not-allowed": "Operation not allowed",
    "auth/weak-password": "Password too weak",
    "auth/too-many-requests": "Too many attempts. Try again later",
  };

  return new Error(errorMap[error.code] || "Authentication failed");
};

export const signUpWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const updateUserPassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User is not logged in.");
    await updatePassword(user, newPassword);
    return "Password updated successfully!";
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const isEmailRegistered = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const logInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const sendPasswordReset = async (email) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export { auth };
