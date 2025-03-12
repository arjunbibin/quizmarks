// Initialize Firebase (Replace with actual Firebase config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const scoresRef = db.ref("quiz_scores");

// Function to update and display teams dynamically
function updateScoreboard(snapshot) {
    const scoreboard = document.getElementById("scoreboard");

    snapshot.forEach((childSnapshot) => {
        const teamData = childSnapshot.val();
        const teamId = childSnapshot.key; // Unique Firebase ID
        let teamDiv = document.getElementById(teamId);

        if (!teamDiv) {
            // Create new team div if it doesn't exist
            teamDiv = document.createElement("div");
            teamDiv.id = teamId;
            teamDiv.classList.add("team");
            scoreboard.appendChild(teamDiv);
        }

        // Update only necessary parts
        teamDiv.innerHTML = `
            <img src="${teamData.logo || './images/default-logo.png'}" class="team-logo">
            <h2 class="team-name">${teamData.name || 'Team'}</h2>
            <p class="team-score">${teamData.score || 0}</p>
        `;
    });
}

// Listen for real-time database changes
scoresRef.on("value", updateScoreboard);
