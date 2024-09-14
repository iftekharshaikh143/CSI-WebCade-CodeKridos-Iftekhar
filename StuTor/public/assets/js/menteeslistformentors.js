import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

async function fetchMentees() {
    try {
        const mentorUserId = localStorage.getItem('mentorUserId');

        if (!mentorUserId) {
            console.error("Mentor User ID not found in local storage.");
            return;
        }
        const acceptedRequestsQuery = query(collection(db, "requests"), where("mentorUserId", "==", mentorUserId), where("accepted", "==", true));
        const querySnapshot = await getDocs(acceptedRequestsQuery);

        const menteesList = document.getElementById('menteesList');
        menteesList.innerHTML = ''; 

        for (const docSnapshot of querySnapshot.docs) {
            const requestData = docSnapshot.data();
            const menteeUserId = requestData.menteeUserId;

            const menteeDocRef = doc(db, "users", menteeUserId);
            const menteeDocSnap = await getDoc(menteeDocRef);

            if (menteeDocSnap.exists()) {
                const menteeData = menteeDocSnap.data();
                 const menteeName = menteeData.fullName || "Unknown";
                const menteeProfilePicURL = menteeData.profilePicURL || ''; 
                const menteeSkills = menteeData.skills || "Not provided";
                const menteePhoneNumber = menteeData.phone || "Not provided";
                const menteeEmail = menteeData.contactEmail || "Not provided";

                const menteeElement = document.createElement('div');
                menteeElement.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'mb-4');

                menteeElement.innerHTML = `
                    <div class="flex items-center mb-4">
                        <img src="${menteeProfilePicURL}" alt="Profile Picture" class="w-16 h-16 rounded-full object-cover mr-4">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">${menteeName}</h2>
                            <p class="text-gray-700 mt-2">Skills: <span class="font-medium text-gray-900">${menteeSkills}</span></p>
                             <p class="text-gray-700 mt-1">Phone: <span class="font-medium text-gray-900">${menteePhoneNumber}</span></p>
                            <p class="text-gray-700 mt-1">Email: <span class="font-medium text-gray-900">${menteeEmail}</span></p>
                        </div>
                    </div>
                `;
                menteesList.appendChild(menteeElement);
            } else {
                console.error(`Mentee document with ID ${menteeUserId} does not exist.`);
            }
        }
    } catch (error) {
        console.error("Error fetching mentees:", error);
    }
}

window.onload = fetchMentees;