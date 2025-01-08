import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgVIoYs7Ykzq78GpttatiNv7Kivq1S7tw",
  authDomain: "user-authentication-bef25.firebaseapp.com",
  projectId: "user-authentication-bef25",
  storageBucket: "user-authentication-bef25.firebasestorage.app",
  messagingSenderId: "740798529706",
  appId: "1:740798529706:web:36dd6b42ccc561b28fd0d3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login');
  const authLink = document.getElementById('hyperlink');
  const phoneEmail = document.getElementById('phone');
  const pass = document.getElementById('pass');
  const confirmpass = document.getElementById('confirmpass');
  const hr=document.getElementById('line');
  const google=document.getElementById('google');

  authLink.addEventListener('click', () => {
    document.getElementById('heading').textContent = 'Create an Account';
    authLink.style.display = 'none';
    loginBtn.textContent = 'Register';
    confirmpass.style.display = 'block';
    hr.style.display="none";
    google.style.display='none'
  });

  loginBtn.addEventListener('click', async () => {
    const emailOrPhone = phoneEmail.value;
    const password = pass.value;

    if (loginBtn.textContent === 'Register') {
      const confirmPassword = confirmpass.value;
      if (password !== confirmPassword || !password) {
        displayError('Passwords do not match or are empty');
        return;
      }

      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      displayError(data.message || data.error);
      if (res.ok) {
        // Clear the form fields after successful registration
        phoneEmail.value = '';
        pass.value = '';
        confirmpass.value = '';
        document.getElementById('heading').textContent = 'Create an Account';
        authLink.style.display = 'block';
        loginBtn.textContent = 'Login';
        confirmpass.style.display = 'none';
         hr.style.display="block";
    google.style.display='block'
    
      }
    } else {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      const data = await res.json();
      displayError(data.message || data.error);
      if (res.ok) {
        // Clear the form fields after successful login
        phoneEmail.value = '';
        pass.value = '';
        window.location.href = "https://murugan-s1234.github.io/Fish_e-commerce/";
      }
    }
  });

  // Google Sign-In
  const googleButton = document.querySelector("#google button");

  googleButton.addEventListener("click", () => {
    console.log("Started sign-in");
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Success");
        const user = result.user;
        console.log("User signed in:", user);
        saveUserToDatabase(user.email, user.uid); // Pass the Firebase UID
      })
      .catch((error) => {
        displayError(error.massage);
      });
  });

  function saveUserToDatabase(email, firebaseUid) {
    fetch("http://localhost:5000/auth/saveUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firebaseUid }), // Send Firebase UID as well
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User saved:", data);
        displayError("User saved successfully");
        window.location.href = "https://murugan-s1234.github.io/Fish_e-commerce/";
      })
      .catch((error) => {
        displayError(error.massage);
      });
  }
});

function displayError(message) {
  const errorMessageElement = document.getElementById('message')
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = "red";
  errorMessageElement.style.fontSize = "12px";
  errorMessageElement.style.marginTop = "5px";

}
