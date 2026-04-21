const COLOURS = [
  '#c4873c', '#2e5fa3', '#3a7d3a', '#8c3a3a',
  '#5a3a8c', '#3a7a8c', '#8c7a3a', '#1e6b5a',
];

function pickColour(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLOURS[Math.abs(h) % COLOURS.length];
}

// ── Modal ──────────────────────────────────────────────────────────
function openModal(team, trainers) {
  const colour   = pickColour(team.name);
  const teamTrainers = trainers.filter(t => t.teamId === team.id);

  document.getElementById('modal-banner').style.background = colour;
  document.getElementById('modal-name').textContent        = team.name;
  document.getElementById('modal-region').textContent      = `Regio ${team.regionId}`;
  document.getElementById('modal-division').textContent    = `Divisie ${team.divisionId}`;

  const trainerList = document.getElementById('modal-trainers');
  if (teamTrainers.length === 0) {
    trainerList.innerHTML = '<li>Geen trainers gevonden</li>';
  } else {
    trainerList.innerHTML = teamTrainers.map(t =>
      `<li><span class="trainer-name">${t.trainerName}</span><span class="trainer-country">${t.country}</span></li>`
    ).join('');
  }

  document.getElementById('team-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('team-modal').classList.remove('open');
}

// ── Init ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('teams-container');

  Promise.all([
    fetch('http://localhost:5167/api/Team').then(r => r.json()),
    fetch('http://localhost:5167/api/Trainer').then(r => r.json()),
  ])
  .then(([teams, trainers]) => {
    container.innerHTML = '';
    teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.innerHTML = `
        <div class="team-banner" style="background:${pickColour(team.name)}"></div>
        <span class="team-name">${team.name}</span>`;
      card.addEventListener('click', () => openModal(team, trainers));
      container.appendChild(card);
    });
  })
  .catch(err => {
    container.innerHTML = `<p>Kon ploegen niet laden: ${err.message}</p>`;
  });

  // Close modal on backdrop click
  document.getElementById('team-modal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
});