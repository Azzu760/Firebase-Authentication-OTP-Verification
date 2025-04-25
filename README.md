```markdown
# 🔐 Authentication using Firebase with OTP Verification

This project is a **Vite + React** based authentication system using **Firebase Authentication**, **EmailJS** for email communication, and **Material UI (MUI)** for the UI. It supports:

- 📧 Email & Password Signup/Login  
- 📱 OTP-based Email Authentication  
- 🔄 Password Reset via Email using EmailJS  
- 🔒 Protected Routes  
- 🎨 Beautiful UI with MUI  
- 🧩 Reusable and modular components

---

## 🚀 Features

- 🔐 Firebase Email & Password Authentication  
- 📱 OTP (Phone Number) Authentication with Firebase  
- 🔄 Password Reset via Email (EmailJS)  
- 🛡️ Protected Routes using PrivateRoute  
- 🧠 Form Validation  
- 🎨 UI components using Material UI (MUI)  
- 📦 Environment Variable Setup for Firebase & EmailJS  
- ⚡ Vite for fast development

---

## 🛠️ Tech Stack

- [Vite](https://vitejs.dev/)  
- [React](https://react.dev/)  
- [Firebase](https://firebase.google.com/)  
- [EmailJS](https://www.emailjs.com/)  
- [Material UI](https://mui.com/)  
- [Bootstrap](https://bootstrap.com/) *(optional or combined with MUI)*  
- dotenv for environment variables

---

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)  
2. Create a new project.  
3. Enable Authentication → Email/Password and Phone  
4. Copy the Firebase SDK config from **Project Settings > General**

---

## ✉️ EmailJS Setup

1. Sign up on [EmailJS](https://emailjs.com/)  
2. Create a new email service & template  
3. Retrieve the following:  
   - `SERVICE_ID`  
   - `TEMPLATE_ID`  
   - `PUBLIC_KEY`  

---

## 🔐 .env Setup

Create a `.env` file in the root of your project:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 📦 Installation & Usage

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/firebase-auth-otp-emailjs-vite.git
cd firebase-auth-otp-emailjs-vite
```

### 2. Install dependencies

```bash
npm install
```

Dependencies include:
- firebase
- emailjs-com
- @mui/material @emotion/react @emotion/styled
- bootstrap
- react-router-dom
- dotenv

### 3. Run the project

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---
