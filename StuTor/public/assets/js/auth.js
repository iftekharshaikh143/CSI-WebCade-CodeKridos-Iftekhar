import { auth, db } from './firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export { auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, doc, getDoc, setDoc };

import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, linkWithRedirect } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

async function signInWithGoogle() {
  try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem('mentorUserId', user.uid);

      if (window.location.pathname.endsWith('login.html')) {
          checkUserStatus(user);
      } else if (window.location.pathname.endsWith('signup.html')) {
          await setDoc(doc(db, "users", user.uid), {
              onboarded: false,
              role: role.value, 
          });
          window.location.href = 'index.html'; 
      }
  } catch (error) {
      console.error("Error signing in with Google:", error);
  }
}

document.getElementById('google-login')?.addEventListener('click', signInWithGoogle);
document.getElementById('google-signup')?.addEventListener('click', signInWithGoogle);

let currentUser = undefined;

async function checkUserStatus(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    if (userData.onboarded) {

      window.location.href = userData.role === 'Mentor' ? 'mentor.html' : 'mentee.html';
    } else {

      window.location.href = userData.role === 'Mentor' ? 'onboardingmentor.html' : 'onboardingmentee.html';
    }
  } else {

    window.location.href = 'onboarding.html';
  }
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('login.html');
  const isSignupPage = currentPath.endsWith('signup.html');
  const isIndexPage = currentPath.endsWith('index.html');

  if (user) {
    if (!isLoginPage && !isSignupPage) {
      checkUserStatus(user);
    }
  } else {
    if (!isIndexPage && !isLoginPage && !isSignupPage) {
      window.location.href = 'login.html';
    }
  }
});

const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    if (document.getElementById('role').value === 'Mentor') {
      var mentor_rating = 5;
      var availability = true;
    }
    else {
      var mentor_rating = 0;
      var availability = false;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        onboarded: false,
        role: role,
        rating: mentor_rating,
        availability: availability,
      });

      localStorage.setItem('menteeUserId', userId);

      window.location.href = 'index.html';
    } catch (error) {
      console.error("Error signing up:", error);
      alert(`Error: ${error.message}`);
    }

  });
}

const loginForm = document.getElementById('login-form');
const statusMessage = document.getElementById('status-message');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role;

        if (userRole === 'Mentor') {
          localStorage.setItem('mentorUserId', userId);
          console.log("Mentor ID stored in local storage:", userId);
        } else {
          localStorage.setItem('menteeUserId', userId);
          console.log("Mentee ID stored in local storage:", userId);
        }

        if (statusMessage) {
          statusMessage.textContent = "Logged in successfully!";
          statusMessage.classList.remove('hidden');
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        console.error("No user document found.");
        alert("Error retrieving user data. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email. Please sign up.");
      } else {
        alert("Error logging in. Please try again.");
      }
    }
  });
}