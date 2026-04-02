// ── Colour palette for shirt banners ──────────────────────────────
const COLOURS = [
  ['#c4873c', '#8c5a1e'],
  ['#2e5fa3', '#1a3a6b'],
  ['#3a7d3a', '#1e4a1e'],
  ['#8c3a3a', '#5a1e1e'],
  ['#5a3a8c', '#3a1e5a'],
  ['#3a7a8c', '#1e4a5a'],
  ['#8c7a3a', '#5a4a1e'],
  ['#1e6b5a', '#0e3a30'],
];

function pickColour(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return COLOURS[Math.abs(h) % COLOURS.length];
}


// ── Build a single team card ───────────────────────────────────────
function buildCard(team) {
  const [c1, c2] = pickColour(team.name);

  // Support various possible API field names gracefully
  const city    = team.city    || team.stad      || team.location     || '';
  const coach   = team.coach   || team.trainer   || team.headCoach    || '';
  const founded = team.foundedYear || team.opgericht || team.founded  || team.year || '';
  const players = team.players ?? team.spelers   ?? team.playerCount  ?? team.numberOfPlayers ?? null;

  const card = document.createElement('a');
  card.className = 'team-card';
  card.href = '#';
  card.dataset.name = team.name.toLowerCase();

  const metaItems = [
    city    ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>${city}</span>` : '',
    coach   ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>${coach}</span>` : '',
    founded ? `<span class="meta-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${founded}</span>` : '',
  ].filter(Boolean).join('');

  const arrowSVG = `<svg class="card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  const footer = players !== null
    ? `<div class="card-divider"></div>
       <div class="card-footer">
         <div class="players-block">
           <div class="players-label">Spelers</div>
           <div class="players-count">${players}</div>
         </div>
         ${arrowSVG}
       </div>`
    : `<div class="card-footer" style="justify-content:flex-end;margin-top:auto;padding-top:0.4rem;">${arrowSVG}</div>`;

  card.innerHTML = `
    <div class="card-banner" style="background: linear-gradient(135deg, ${c1}, ${c2});">
    </div>
    <div class="card-body">
      <div class="team-name">${team.name}</div>
      ${metaItems ? `<div class="team-meta">${metaItems}</div>` : ''}
      ${footer}
    </div>`;

  return card;
}

// ── Filter on search ───────────────────────────────────────────────
function filterTeams() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('#teams-container .team-card');
  let visible = 0;
  cards.forEach(card => {
    const show = card.dataset.name.includes(q);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  document.getElementById('emptyState').style.display = (visible === 0 && cards.length > 0) ? 'block' : 'none';
  updateCount(visible);
}

function updateCount(n) {
  document.getElementById('teamCount').innerHTML =
    n === 1 ? `<strong>1</strong> ploeg` : `<strong>${n}</strong> ploegen`;
}

// ── Fetch from backend ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('teams-container');

  fetch('http://localhost:5167/api/Team')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status} – ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      container.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<div class="error-state" style="display:block;">
          <p>Geen ploegen gevonden<em>.</em></p>
          <span>De API gaf een lege lijst terug</span>
        </div>`;
        updateCount(0);
        return;
      }

      data.forEach(team => container.appendChild(buildCard(team)));
      updateCount(data.length);
    })
    .catch(error => {
      console.error('Fout bij teamdata ophalen:', error);
      container.innerHTML = `<div class="error-state" style="display:block;">
        <p>Kon ploegen niet laden<em>.</em></p>
        <span>Controleer of uw backend actief is op poort 5167.</span>
        <code>${error.message}</code>
      </div>`;
      document.getElementById('teamCount').textContent = '';
    });
});