import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// ✅ Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
   apiKey: "AIzaSyBwZTpGPwFkOWv_HKZF6D4P89adXVCTo98",
   authDomain: "quizmark-f63ad.firebaseapp.com",
   databaseURL: "https://quizmark-f63ad-default-rtdb.asia-southeast1.firebasedatabase.app",
   projectId: "quizmark-f63ad",
   storageBucket: "quizmark-f63ad.appspot.com",
   messagingSenderId: "605840659216",
   appId: "1:605840659216:web:2e2a8d91220865a8570b95",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const scoresRef = ref(database, "quiz_scores");

// ✅ Update Scoreboard in Real-Time
onValue(scoresRef, (snapshot) => {
    const scoreboard = document.getElementById("scoreboard");
    scoreboard.innerHTML = ""; // Clear previous entries

    snapshot.forEach((childSnapshot) => {
        const team = childSnapshot.val();
        if (team && team.name && team.score !== undefined) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `🏆 <strong>${team.name}</strong>: ${team.score} points`;
            scoreboard.appendChild(listItem);
        }
    });
});
