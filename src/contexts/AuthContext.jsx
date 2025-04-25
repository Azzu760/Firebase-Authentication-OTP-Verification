import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  signUpWithEmailAndPassword,
  logInWithEmailAndPassword,
  signInWithGoogle,
  isEmailRegistered,
  updateUserPassword,
} from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  generateOTP,
  storeOTP,
  verifyOTP as checkOTP,
} from "../services/otpService";
import sendOtpEmail from "../services/emailService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const checkEmailRegistered = async (email) => {
    if (!email) throw new Error("Email is required");

    const alreadyExists = await isEmailRegistered(email);
    if (alreadyExists) {
      throw new Error("Email is already registered. Try logging in.");
    }
  };

  const signup = async (email, password, name) => {
    try {
      const otp = generateOTP();

      setPendingUser({
        email,
        password,
        name,
        otp,
      });

      await storeOTP(email, otp);
      await sendOtpEmail(email, otp);
      sessionStorage.setItem("otp_email", email);

      return otp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeSignup = async () => {
    try {
      if (!pendingUser) throw new Error("Signup process not started");

      const user = await signUpWithEmailAndPassword(
        pendingUser.email,
        pendingUser.password,
        pendingUser.name
      );

      setPendingUser(null);
      sessionStorage.removeItem("otp_email");

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      return (await logInWithEmailAndPassword(email, password)).user;
    } catch (err) {
      setError(
        {
          "auth/invalid-credential": "Invalid email or password",
          "auth/wrong-password": "Invalid email or password",
          "auth/user-not-found": "No account found",
          "auth/too-many-requests": "Account temporarily locked",
        }[err.code] || "Login failed"
      );
      throw err;
    }
  };

  const googleLogin = async () => {
    try {
      return await signInWithGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (newPassword) => {
    try {
      await updateUserPassword(newPassword);
      password;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const sendOTP = async (email) => {
    try {
      const otp = generateOTP();
      await storeOTP(email, otp);
      await sendOtpEmail(email, otp);
      return otp;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const isValid = await checkOTP(email, otp);
      if (!isValid) throw new Error("Invalid OTP or OTP expired");

      if (pendingUser && pendingUser.email === email) {
        return await completeSignup(otp);
      }

      return isValid;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    pendingUser,
    signup,
    checkEmailRegistered,
    completeSignup,
    login,
    googleLogin,
    logout,
    resetPassword,
    sendOTP,
    verifyOTP,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
