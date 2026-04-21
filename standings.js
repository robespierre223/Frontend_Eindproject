document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("standings-container");

    Promise.all([
        fetch("http://localhost:5167/api/Match").then(res => res.json()),
        fetch("http://localhost:5167/api/Team").then(res => res.json())
    ])
    .then(([matches, teams]) => {

        // Init standings per team
        const standings = {};
        teams.forEach(team => {
            standings[team.id] = { name: team.name, points: 0 };
        });

        // Calculate points
        matches.forEach(match => {
            const teamA = standings[match.teamAid];
            const teamB = standings[match.teamBid];
            if (!teamA || !teamB) return;

            if (match.scoreTeamA > match.scoreTeamB)     
                { teamA.points += 3; }
            else if (match.scoreTeamA < match.scoreTeamB) 
                { teamB.points += 3; }
            else   
                { teamA.points += 1; teamB.points += 1; }
        });

        // Sort by points
        const table = Object.values(standings).sort((a, b) => b.points - a.points);

        // Build table
        const tableEl = document.createElement("table");
        tableEl.className = "standings-table";
        tableEl.innerHTML = `
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Punten</th>
              </tr>
            </thead>
            <tbody></tbody>`;

        const tbody = tableEl.querySelector("tbody");
        table.forEach((team, index) => {
            const row = document.createElement("tr");
            const rank = index + 1;
            row.innerHTML = `
                <td class="rank-${rank <= 3 ? rank : ''}">${rank}</td>
                <td class="td-name">${team.name}</td>
                <td>${team.points}</td>`;
            tbody.appendChild(row);
        });

        container.innerHTML = '';
        container.appendChild(tableEl);
    })
    .catch(error => {
        console.error("Fout bij laden klassement:", error);
        container.innerHTML = `<p style="color:var(--warm-mid); padding:2rem;">Kon klassement niet laden: ${error.message}</p>`;
    });
});