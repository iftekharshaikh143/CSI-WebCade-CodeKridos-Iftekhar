import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
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

async function fetchMenteeData(menteeUserId) {
    const docRef = doc(db, "users", menteeUserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const menteeData = docSnap.data();

        const menteeCard = document.createElement('div');
        menteeCard.classList.add('mentor-card', 'bg-white', 'p-6', 'rounded-lg', 'shadow-md');
        menteeCard.innerHTML = `
            <div class="flex items-center mb-4">
                <img src="${menteeData.profilePicURL || ''}" alt="Profile Picture" class="w-16 h-16 rounded-full object-cover mr-4">
                <div>
                    <h2 class="text-xl font-bold">${menteeData.fullName || "Not provided"}</h2>
                    <p class="text-gray-600">${menteeData.contactEmail || "Not provided"}</p>
                    <p class="text-gray-600">${menteeData.phone || "Not provided"}</p>
                </div>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-2">Skills:</h3>
                <ul class="list-disc list-inside text-gray-700">
                    ${menteeData.skills ? menteeData.skills.map(skill => `<li>${skill}</li>`).join('') : ''}
                </ul>
            </div>
        `;

        document.getElementById('menteeList').appendChild(menteeCard);
    } else {
        console.error("No such mentee!");
    }
}

async function checkMenteeRequests() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const mentorUserId = user.uid;
            console.log("Current mentorUserId:", mentorUserId);

            const requestsRef = collection(db, "requests");
            const q = query(requestsRef, where("mentorUserId", "==", mentorUserId), where("accepted", "==", true));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No accepted requests found for this mentor.");
                return;
            }

            querySnapshot.forEach(async (doc) => {
                const requestData = doc.data();
                console.log("Request data:", requestData);

                const menteeUserId = requestData.menteeUserId;

                if (menteeUserId) {
                    await fetchMenteeData(menteeUserId);
                } else {
                    console.error("No mentee ID found in the request.");
                }
            });
        } else {
            console.error("No user is signed in.");
        }
    });
}

window.onload = function() {
    checkMenteeRequests();
};