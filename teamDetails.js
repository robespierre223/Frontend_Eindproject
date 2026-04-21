document.addEventListener('DOMContentLoaded', function () {
  const id = new URLSearchParams(window.location.search).get('id');

  Promise.all([
    fetch(`http://localhost:5167/api/Team/${id}`).then(r => r.json()),
    fetch('http://localhost:5167/api/Trainer').then(r => r.json()),
  ])
  .then(([team, trainers]) => {
    const teamTrainers = trainers.filter(t => t.teamId === team.id);

    // Fill in page
    document.title = team.name;
    document.getElementById('team-name').textContent      = team.name;
    document.getElementById('team-name-deco').textContent = team.name;
    document.getElementById('team-region').textContent    = `Regio ${team.regionId}`;
    document.getElementById('team-division').textContent  = `Divisie ${team.divisionId}`;

    // Colour banner
    const colour = pickColour(team.name);
    document.getElementById('detail-banner').style.background = colour;
    document.getElementById('deco-dot').style.background      = colour;

    // Trainers
    const list = document.getElementById('trainer-list');
    if (teamTrainers.length === 0) {
      list.innerHTML = '<li class="trainer-empty">Geen trainers gevonden</li>';
    } else {
      list.innerHTML = teamTrainers.map(t => `
        <li class="trainer-row">
          <span class="trainer-name">${t.trainerName}</span>
          <span class="trainer-country">${t.country}</span>
        </li>`).join('');
    }
  })
  .catch(err => {
    document.getElementById('detail-content').innerHTML =
      `<p style="color:var(--warm-mid);padding:2rem;">Kon teaminfo niet laden: ${err.message}</p>`;
  });
});

// Same colour function as teams.js
const COLOURS = [
  '#c4873c', '#2e5fa3', '#3a7d3a', '#8c3a3a',
  '#5a3a8c', '#3a7a8c', '#8c7a3a', '#1e6b5a',
];
function pickColour(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLOURS[Math.abs(h) % COLOURS.length];
}