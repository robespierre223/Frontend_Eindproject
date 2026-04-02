document.addEventListener("DOMContentLoaded", function () {
    const matchContainer = document.getElementById("match-container");

    fetch("http://localhost:5167/api/Match")
        .then(response => response.json())
        .then(data => {
            data.forEach(match => {
                const matchElement = document.createElement("p"); // paragraph
                const matches = match.teamA + " " + match.scoreTeamA + " - " + match.scoreTeamB + " " + match.teamB;
                matchElement.textContent = matches
                matchContainer.appendChild(matchElement);
            });
        })
        .catch(error => {
            console.error('Fout bij matchdata ophalen', error);
        });
});