document.addEventListener("DOMContentLoaded", function () {
    const teamContainer = document.getElementById("teams-container");

    fetch("http://localhost:5167/api/Team")
        .then(response => response.json())
        .then(data => {
            data.forEach(team => {
                const teamElement = document.createElement("p"); // paragraph
                teamElement.textContent = team.name; // 👈 THIS shows the name
                teamContainer.appendChild(teamElement);
            });
        })
        .catch(error => {
            console.error('Fout bij Teamdata ophalen', error);
        });
    const matchContainer = document.getElementById("matches-container")
    fetch("http://localhost:5167/api/Match")
        .then(response => response.json())
        .then(data => {
            data.forEach(match => {
                const matchElement = document.createElement("p"); // paragraph
                teamElement.textContent = match.teamA + match.scoreTeamA + match.scoreTeamB + match.teamB ; // 👈 THIS shows the name
                matchContainer.appendChild(matchElement);
            });
        })
        .catch(error => {
            console.error('Fout bij Teamdata ophalen', error);
        });
});