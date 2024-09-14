import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
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

async function fetchMentorData(userId) {
    if (userId) {
        const docRef = doc(db, "users", userId); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const mentorData = docSnap.data();

            document.getElementById('fullName').textContent = mentorData.fullName || "Not provided";
            document.getElementById('branch').textContent = mentorData.branch || "Not provided";
            document.getElementById('currentYear').textContent = mentorData.year || "Not provided";
            document.getElementById('bio').textContent = mentorData.bio || "Not provided";
            document.getElementById('subjects').textContent = mentorData.subjects.join(", ") || "No subjects listed";
            document.getElementById('skills').textContent = mentorData.skills.join(", ") || "No skills listed";

            const profilePic = document.getElementById('ppffpp');
            profilePic.src = mentorData.profilePicURL || profilePic.src;

            const rating = mentorData.rating || 0;
            displayStars(rating);

            const availability = mentorData.availability ? 'Available' : 'Unavailable';
            const availabilityColor = mentorData.availability ? 'green' : 'red';
            document.getElementById('availability').textContent = availability;
            document.getElementById('availability').style.color = availabilityColor;

        } else {
            console.error("No such mentor!");
        }
    } else {
        console.error("No user ID found.");
    }
}

function displayStars(rating) {
    const starContainer = document.getElementById('rating');
    starContainer.innerHTML = ''; 
    for (let i = 0; i < rating; i++) {
        const star = document.createElement('span');
        star.textContent = '⭐'; 
        starContainer.appendChild(star);
    }
}

function storeMenteeUserId() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {

            const menteeUserId = user.uid;
            localStorage.setItem('menteeUserId', menteeUserId);
            console.log("Mentee User ID stored in local storage:", menteeUserId);
        } else {

            console.error("No user is signed in.");
        }
    });
}

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function() {

    let userId = getQueryParameter('mentorId');
    console.log("Mentor User ID from query string:", userId);

    if (!userId) {
        userId = localStorage.getItem('mentorUserId');
        console.log("Mentor User ID from local storage:", userId);
    }

    if (userId) {
        fetchMentorData(userId);
    } else {
        console.error("No mentorUserId found in the query string or local storage.");
    }

    storeMenteeUserId(); 
};

document.getElementById('bookSession').addEventListener('click', function() {
    alert('Redirecting to Book a Study Session...');
});

document.getElementById('careerGuidance').addEventListener('click', function() {
    alert('Redirecting to Career Guidance...');
});

document.getElementById('giveRating').addEventListener('click', function() {
    document.getElementById('ratingPopup').classList.remove('hidden');
});

const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-rating'));
        highlightStars(selectedRating);
    });
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-500'); 
            star.classList.remove('text-gray-400'); 
        } else {
            star.classList.add('text-gray-400'); 
            star.classList.remove('text-yellow-500'); 
        }
    });
}

document.getElementById('cancelRating').addEventListener('click', function() {
    document.getElementById('ratingPopup').classList.add('hidden');
});

document.getElementById('submitRating').addEventListener('click', async function() {
    if (selectedRating === 0) {
        alert('Please select a rating!');
        return;
    }

    const mentorUserId = getQueryParameter('mentorId');
    if (!mentorUserId) {
        alert('Mentor ID not found.');
        return;
    }

    try {

        const mentorRef = doc(db, "users", mentorUserId);
        await updateDoc(mentorRef, { rating: selectedRating });

        alert('Rating submitted successfully!');
        document.getElementById('ratingPopup').classList.add('hidden');
    } catch (error) {
        console.error('Error submitting rating:', error);
        alert('Error submitting rating. Please try again.');
    }
});

document.getElementById('connectMentor').addEventListener('click', function() {

    document.getElementById('mentorPopup').classList.remove('hidden');
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    document.getElementById('mentorPopup').classList.add('hidden');
});

function generateInviteId() {
    return Math.random().toString(36).substring(2, 10); 
}

document.getElementById('sendBtn').addEventListener('click', async function() {
    const message = document.getElementById('mentorMessage').value;
    const mentorUserId = getQueryParameter('mentorId'); 
    const menteeUserId = localStorage.getItem('menteeUserId'); 

    if (message.trim() !== "" && mentorUserId && menteeUserId) {

        const inviteId = generateInviteId();

        const requestData = {
            menteeUserId: menteeUserId,
            mentorUserId: mentorUserId,
            message: message,
            accepted: false,
            timestamp: new Date() 
        };

        try {

            await setDoc(doc(db, "requests", inviteId), requestData);

            alert("Your message has been sent!");
            document.getElementById('mentorPopup').classList.add('hidden');
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("There was an error sending your message. Please try again.");
        }
    } else {
        alert("Please enter a message before sending.");
    }
});