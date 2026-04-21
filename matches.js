document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('match-container');

  Promise.all([
    fetch('http://localhost:5167/api/Match').then(r => r.json()),
    fetch('http://localhost:5167/api/Team').then(r => r.json()),
  ])
  .then(([matches, teams]) => {
    const teamMap = {};
    teams.forEach(t => { teamMap[t.id] = t.name; });

    container.innerHTML = '';
    matches.forEach(match => {
      const teamA = teamMap[match.teamAid] || '?';
      const teamB = teamMap[match.teamBid] || '?';
      const score = (match.scoreTeamA != null && match.scoreTeamB != null)
        ? `${match.scoreTeamA} – ${match.scoreTeamB}`
        : 'vs';

      const row = document.createElement('div');
      row.className = 'match-card';
      row.innerHTML = `
        <span class="match-team-a">${teamA}</span>
        <span class="match-score">${score}</span>
        <span class="match-team-b">${teamB}</span>`;
      container.appendChild(row);
    });
  })
  .catch(err => {
    container.innerHTML = `<p>Kon wedstrijden niet laden: ${err.message}</p>`;
  });
});