import { auth, db, storage } from './firebase.js';  
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

document.getElementById('mentorOnboardingForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();  

  const user = auth.currentUser;  
  if (!user) {
    alert("User not authenticated!");
    return;
  }

  const fullName = document.getElementById('fullName').value;
  const year = document.getElementById('year').value;
  const branch = document.getElementById('branch').value;
  const bio = document.getElementById('bio').value;
  const phone = document.getElementById('phoneNumber').value;
  const contactEmail = document.getElementById('contactEmail').value;
  const careerAspirations = document.getElementById('aspirations').value;
  const slots = document.getElementById('slots').value;
  const profilePicFile = document.getElementById('profilePicture').files[0];

  const subjectElements = document.querySelectorAll('input[name="subjects"]:checked');
  const subjects = Array.from(subjectElements).map(el => el.value);

  const skillElements = document.querySelectorAll('input[name="skills"]:checked');
  const skills = Array.from(skillElements).map(el => el.value);

  try {
    let profilePicURL = '';

    if (profilePicFile) {
      const profilePicRef = ref(storage, `profile_pics/${user.uid}/${profilePicFile.name}`);

      const uploadResult = await uploadBytes(profilePicRef, profilePicFile);

      profilePicURL = await getDownloadURL(uploadResult.ref);
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {

      await setDoc(userDocRef, {
        onboarded: true,  
        fullName: fullName,
        year: year,
        branch: branch,
        bio: bio,
        phone: phone,
        contactEmail: contactEmail,
        careerAspirations: careerAspirations,
        profilePicURL: profilePicURL,  
        subjects: subjects,  
        skills: skills,  
        slots: slots
      }, { merge: true });  

      alert("Mentor onboarding completed successfully!");
      window.location.href = 'index.html';

    } else {
      alert("User document not found!");
    }
  } catch (error) {
    console.error("Error during onboarding:", error);
    alert("An error occurred during onboarding. Please try again.");
  }
});