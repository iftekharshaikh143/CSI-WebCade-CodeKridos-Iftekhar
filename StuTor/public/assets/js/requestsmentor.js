import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

async function fetchRequests() {
    try {
        const mentorUserId = localStorage.getItem('mentorUserId');

        if (!mentorUserId) {
            console.error("Mentor User ID not found in local storage.");
            return;
        }

        const requestsQuery = query(collection(db, "requests"), where("mentorUserId", "==", mentorUserId));
        const querySnapshot = await getDocs(requestsQuery);

        const requestsList = document.getElementById('requestsList');
        requestsList.innerHTML = ''; 

        for (const docSnapshot of querySnapshot.docs) {
            const requestData = docSnapshot.data();
            const requestMenteeUserId = requestData.menteeUserId;
            const message = requestData.message;

            const menteeDocRef = doc(db, "users", requestMenteeUserId);
            const menteeDocSnap = await getDoc(menteeDocRef);

            if (menteeDocSnap.exists()) {
                const menteeData = menteeDocSnap.data();
                const menteeName = menteeData.fullName || "Unknown";
                const menteeProfilePicURL = menteeData.profilePicURL || ''; 

                const requestElement = document.createElement('div');
                requestElement.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'mb-4');

                requestElement.innerHTML = `
                    <div class="flex items-center mb-4">
                        <img src="${menteeProfilePicURL}" alt="Profile Picture" class="w-16 h-16 rounded-full object-cover mr-4">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">Mentee Request</h2>
                            <p class="text-gray-700 mt-2">Request from <span class="font-medium text-gray-900">${menteeName}</span></p>
                            <p class="text-gray-700 mt-1">Message: <span class="font-medium text-gray-900">${message}</span></p>
                        </div>
                    </div>
                    <div class="mt-4 flex space-x-4">
                        <button class="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition" data-request-id="${docSnapshot.id}" data-action="accept">Accept</button>
                        <button class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition" data-request-id="${docSnapshot.id}" data-action="reject">Reject</button>
                    </div>
                `;

                requestsList.appendChild(requestElement);
            } else {
                console.error(`Mentee document with ID ${requestMenteeUserId} does not exist.`);
            }
        }

        requestsList.addEventListener('click', async function(event) {
            if (event.target.tagName === 'BUTTON') {
                const requestId = event.target.getAttribute('data-request-id');
                const action = event.target.getAttribute('data-action');

                try {
                    const requestDocRef = doc(db, "requests", requestId);
                    if (action === 'accept') {
                        await updateDoc(requestDocRef, { accepted: true });
                        alert("Request accepted!");
                    } else if (action === 'reject') {
                        await deleteDoc(requestDocRef);
                        alert("Request rejected and removed!");
                    }
                } catch (error) {
                    console.error("Error processing request:", error);
                }

                fetchRequests();
            }
        });

    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

window.onload = fetchRequests;