// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, remove, update, onValue, push } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwZTpGPwFkOWv_HKZF6D4P89adXVCTo98",
    authDomain: "quizmark-f63ad.firebaseapp.com",
    databaseURL: "https://quizmark-f63ad-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quizmark-f63ad",
    storageBucket: "quizmark-f63ad.appspot.com",
    messagingSenderId: "605840659216",
    appId: "1:605840659216:web:2e2a8d91220865a8570b95",
    measurementId: "G-S0JMKMW81J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const teamsRef = ref(database, "quiz_scores");

// DOM Elements
const newTeamName = document.getElementById("newTeamName");
const addTeamBtn = document.getElementById("addTeamBtn");
const teamsList = document.getElementById("teamsList");
const updateScoreList = document.getElementById("updateScoreList");
const statusMessage = document.getElementById("statusMessage");

// Add a new team to Firebase
addTeamBtn.addEventListener("click", () => {
    const teamName = newTeamName.value.trim();
    if (teamName === "") {
        statusMessage.textContent = "⚠ Please enter a team name.";
        return;
    }

    const newTeamRef = push(teamsRef); // Generate unique ID

    set(newTeamRef, {
        name: teamName,
        score: 0
    }).then(() => {
        console.log("✅ Team added:", teamName);
        statusMessage.textContent = "✅ Team added successfully!";
        newTeamName.value = "";
    }).catch((error) => {
        console.error("❌ Firebase Error:", error);
        statusMessage.textContent = "❌ Error adding team: " + error.message;
    });
});

// Fetch and Display Teams
onValue(teamsRef, (snapshot) => {
    teamsList.innerHTML = "";
    updateScoreList.innerHTML = "";

    if (!snapshot.exists()) {
        teamsList.innerHTML = "<p>No teams added yet.</p>";
        return;
    }

    snapshot.forEach((childSnapshot) => {
        const team = childSnapshot.val();
        const teamId = childSnapshot.key;

        // Display Team in List with Delete Button
        const li = document.createElement("li");
        li.textContent = `${team.name} `;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌ Remove";
        deleteBtn.onclick = () => remove(ref(database, `quiz_scores/${teamId}`))
            .then(() => console.log(`✅ Team ${team.name} removed.`))
            .catch(error => console.error("❌ Error deleting team:", error));
        li.appendChild(deleteBtn);
        teamsList.appendChild(li);

        // Score Update Section
        const scoreLi = document.createElement("li");
        scoreLi.innerHTML = `
            <span>${team.name}: </span>
            <input type="number" id="score-${teamId}" value="${team.score}">
            <button onclick="updateScore('${teamId}')">💾 Save</button>
        `;
        updateScoreList.appendChild(scoreLi);
    });
});

// Update Score Function
window.updateScore = (teamId) => {
    const newScore = document.getElementById(`score-${teamId}`).value;
    update(ref(database, `quiz_scores/${teamId}`), { score: parseInt(newScore) })
        .then(() => {
            console.log(`✅ Score updated for ${teamId}: ${newScore}`);
            statusMessage.textContent = "✅ Score updated!";
        })
        .catch((error) => {
            console.error("❌ Error updating score:", error);
            statusMessage.textContent = "❌ Error updating score: " + error.message;
        });
};
