import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTXOzk-Kr0BJ1OcRocHECvvSYOY86LIWo",
    authDomain: "stutor-codekridos.firebaseapp.com",
    projectId: "stutor-codekridos",
    storageBucket: "stutor-codekridos.appspot.com",
    messagingSenderId: "952917641380",
    appId: "1:952917641380:web:b44131d13fa9c8da88fe31",
    measurementId: "G-Q1JVTLFWV3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);  

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const menteeUserId = user.uid;
        localStorage.setItem('menteeUserId', menteeUserId);  

        await fetchMenteeDetails();
        await fetchMentors();
    } else {
        console.error("No user is authenticated");

        window.location.href = "login.html";
    }
});

async function fetchMenteeDetails() {
    const menteeUserId = localStorage.getItem('menteeUserId');

    if (!menteeUserId) {
        console.error("Mentee User ID not found in local storage.");
        return null;
    }

    try {
        const menteeRef = doc(db, 'users', menteeUserId);
        const menteeDoc = await getDoc(menteeRef);

        if (menteeDoc.exists()) {
            const menteeData = menteeDoc.data();
            console.log('Mentee Details:', menteeData);
            return { 
                skills: menteeData.skills || [],
                subjects: menteeData.subjects || []
            };
        } else {
            console.error('No mentee document found!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching mentee details:', error);
        return null;
    }
}

async function fetchMentors() {
    const menteeDetails = await fetchMenteeDetails();
    if (!menteeDetails) return;

    const { skills: menteeSkills, subjects: menteeSubjects } = menteeDetails;

    try {

        const mentorsQuery = query(collection(db, "users"), where('role', '==', 'Mentor'));
        const querySnapshot = await getDocs(mentorsQuery);

        const mentorCardsContainer = document.querySelector('.mentor-cards-container');
        mentorCardsContainer.innerHTML = ''; 

        querySnapshot.forEach(docSnapshot => {
            const mentorData = docSnapshot.data();
            const mentorId = docSnapshot.id; 
            const mentorSkills = mentorData.skills || [];
            const mentorSubjects = mentorData.subjects || [];
            const mentorBio = (mentorData.bio && mentorData.bio.length > 50) ? mentorData.bio.substring(0, 50) + '...' : (mentorData.bio || 'No bio available');
            const mentorExpertise = mentorSkills.join(', ') || 'No skills available'; 

            const skillsMatch = menteeSkills.some(skill => mentorSkills.includes(skill));
            const subjectsMatch = menteeSubjects.some(subject => mentorSubjects.includes(subject));

            if (skillsMatch || subjectsMatch) {
                const mentorName = mentorData.fullName || "Unknown";
                const mentorProfilePicURL = mentorData.profilePicURL || ''; 

                const mentorCard = document.createElement('div');
                mentorCard.classList.add('card', 'bg-white', 'shadow-lg', 'rounded-lg', 'overflow-hidden');
                mentorCard.innerHTML = `
                    <img src="${mentorProfilePicURL}" alt="Mentor Image" class="w-full h-48 object-cover">
                    <div class="card-content p-4">
                        <h5 class="text-lg font-semibold">${mentorName}</h5>
                        <p><strong>Experience (Bio):</strong> ${mentorBio}</p>
                        <p><strong>Expertise (Skills):</strong> ${mentorExpertise}</p>
                        <a href="#" class="choose-btn" data-mentor-id="${mentorId}">Choose Mentor</a>
                    </div>
                `;

                mentorCard.querySelector('.choose-btn').addEventListener('click', () => {

                    window.location.href = `mentorboard.html?mentorId=${mentorId}`;
                });

                mentorCardsContainer.appendChild(mentorCard);
            }
        });

    } catch (error) {
        console.error("Error fetching mentors:", error);
    }
}

window.onload = fetchMentors;