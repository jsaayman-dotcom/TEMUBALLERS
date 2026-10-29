// =============================================
// TEMU BALLERS — TEAM DATA
// Update the information in this section.
// =============================================

const DATA = {
  players: [
    { name: "Josh",     goals: 2, assists: null, appearances: 2, position: "Not specified" },
    { name: "Ethan",    goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Josè",     goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Abdou",    goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Adam",     goals: 2, assists: null, appearances: 2, position: "Not specified" },
    { name: "Alex",     goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Brandon",  goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Lathi",    goals: 0, assists: null, appearances: null, position: "Not specified" },
    { name: "Zack",     goals: 1, assists: null, appearances: 1, position: "Not specified" },
    { name: "Manu",     goals: 0, assists: null, appearances: null, position: "Not specified" }
  ],

  results: [
    {
      opponent: "Dark Knights",
      date: "Date not recorded",
      team: 3,
      opponentScore: 3,
      status: "D",
      scorers: ["Josh", "Zack", "Adam"]
    },
    {
      opponent: "FC Sparta",
      date: "Date not recorded",
      team: 2,
      opponentScore: 1,
      status: "W",
      scorers: ["Josh", "Adam"]
    }
  ],

  fixtures: [
    { date: "4 Nov 2026",  time: "18:15", opponent: "Superstrikers",   venue: "Fairview Action Arena" },
    { date: "11 Nov 2026", time: "20:30", opponent: "Depot Utd FC",    venue: "Fairview Action Arena" },
    { date: "18 Nov 2026", time: "19:00", opponent: "Von-Boeties FC",  venue: "Fairview Action Arena" },
    { date: "25 Nov 2026", time: "18:15", opponent: "Teknology FC",    venue: "Fairview Action Arena" },
    { date: "2 Dec 2026",  time: "19:45", opponent: "The Unknowns",    venue: "Fairview Action Arena" },
    { date: "9 Dec 2026",  time: "21:15", opponent: "Quality Control", venue: "Fairview Action Arena" },
    { date: "16 Dec 2026", time: "20:30", opponent: "Toray Logistics", venue: "Fairview Action Arena" }
  ],

  // Each recorded infraction counts as one shot.
  // Add entries here when a shot is incurred.
  shots: [
    // Example:
    // { player: "Josh", reason: "Missed open goal", count: 1, date: "4 Nov 2026" }
  ],

  rules: [
    "Yellow card — one shot.",
    "Green card — one shot.",
    "Injury — one shot, if this is the team's agreed rule.",
    "Own goal — one shot.",
    "Not scoring — one shot.",
    "Missing an open goal — one shot.",
    "Finishing below 4th place — everyone takes a shot."
  ]
};

// =============================================
// RENDERING
// =============================================

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function renderOverview() {
  const played = DATA.results.length;
  const wins = DATA.results.filter(match => match.status === "W").length;
  const draws = DATA.results.filter(match => match.status === "D").length;

  const goalsFor = DATA.results.reduce((sum, match) => sum + match.team, 0);
  const goalsAgainst = DATA.results.reduce((sum, match) => sum + match.opponentScore, 0);
  const points = wins * 3 + draws;
  const difference = goalsFor - goalsAgainst;

  $("#matchesPlayed").textContent = played;
  $("#points").textContent = points;
  $("#goalsFor").textContent = goalsFor;
  $("#goalDifference").textContent =
    difference > 0 ? `+${difference}` : String(difference);
}

function renderResults() {
  const container = $("#resultsList");

  if (!DATA.results.length) {
    container.innerHTML = '<p class="empty-state">No results recorded yet.</p>';
    return;
  }

  container.innerHTML = DATA.results.slice().reverse().map(match => {
    const statusLabel = match.status === "W"
      ? "WIN"
      : match.status === "D"
        ? "DRAW"
        : "LOSS";

    const scorers = match.scorers?.length
      ? `Goals: ${match.scorers.map(escapeHTML).join(", ")}`
      : "Scorers not recorded";

    return `
      <article class="result-card">
        <div class="result-top">
          <span>${escapeHTML(match.date)}</span>
          <span class="result-status">${statusLabel}</span>
        </div>
        <div class="result-scoreline">
          <div class="result-team">Temu Ballers</div>
          <div class="result-score">
            ${match.team}<span>–</span>${match.opponentScore}
          </div>
          <div class="result-team">${escapeHTML(match.opponent)}</div>
        </div>
        <div class="result-footer">${scorers}</div>
      </article>
    `;
  }).join("");
}

function renderFixtures() {
  const body = $("#fixturesTable");

  if (!DATA.fixtures.length) {
    body.innerHTML = `
      <tr><td colspan="5">No upcoming fixtures recorded.</td></tr>
    `;
    return;
  }

  body.innerHTML = DATA.fixtures.map(fixture => `
    <tr>
      <td>${escapeHTML(fixture.date)}</td>
      <td>${escapeHTML(fixture.time)}</td>
      <td class="opponent-cell">${escapeHTML(fixture.opponent)}</td>
      <td>${escapeHTML(fixture.venue)}</td>
      <td><span class="status-pill status-upcoming">UPCOMING</span></td>
    </tr>
  `).join("");
}

function renderPlayers(searchTerm = "") {
  const grid = $("#playersGrid");
  const search = searchTerm.trim().toLowerCase();

  const filtered = DATA.players.filter(player =>
    player.name.toLowerCase().includes(search)
  );

  $("#playerCount").textContent = `${DATA.players.length} PLAYERS`;

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state">No players found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(player => `
    <button class="player-card" type="button"
      data-player="${escapeHTML(player.name)}"
      aria-label="View ${escapeHTML(player.name)}'s profile">
      <span class="player-avatar">${escapeHTML(initials(player.name))}</span>
      <span class="player-name">${escapeHTML(player.name)}</span>
      <span class="player-meta">${escapeHTML(player.position)}</span>
      <span class="player-mini-stats">
        <span><b>${player.goals}</b> Goals</span>
        <span><b>${player.assists ?? "—"}</b> Assists</span>
      </span>
    </button>
  `).join("");
}

function renderLeaderboard(element, field, label) {
  const container = $(element);

  // Null means that the statistic has not been confirmed.
  const recorded = DATA.players.filter(player =>
    Number.isFinite(player[field])
  );

  if (!recorded.length || recorded.every(player => player[field] === 0)) {
    container.innerHTML = `
      <p class="empty-state">No ${label.toLowerCase()} recorded yet.</p>
    `;
    return;
  }

  const ranked = recorded
    .filter(player => player[field] > 0)
    .sort((a, b) => b[field] - a[field] || a.name.localeCompare(b.name));

  if (!ranked.length) {
    container.innerHTML = `
      <p class="empty-state">No ${label.toLowerCase()} recorded yet.</p>
    `;
    return;
  }

  const maxValue = Math.max(...ranked.map(player => player[field]));

  container.innerHTML = ranked.map((player, index) => `
    <div class="leader-row">
      <span class="leader-rank">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <div class="leader-name">${escapeHTML(player.name)}</div>
        <div class="leader-bar">
          <span style="width:${(player[field] / maxValue) * 100}%"></span>
        </div>
      </div>
      <span class="leader-total">${player[field]}</span>
    </div>
  `).join("");
}

function renderStatsTable() {
  const body = $("#statsTable");

  body.innerHTML = DATA.players.map(player => `
    <tr>
      <td class="opponent-cell">${escapeHTML(player.name)}</td>
      <td>${player.appearances ?? "Not recorded"}</td>
      <td>${player.goals}</td>
      <td>${player.assists ?? "Not recorded"}</td>
    </tr>
  `).join("");
}

function renderShots() {
  const body = $("#shotsTable");
  const total = DATA.shots.reduce(
    (sum, entry) => sum + (Number(entry.count) || 0), 0
  );

  $("#totalShots").textContent = total;
  $("#emptyShots").hidden = DATA.shots.length > 0;

  if (!DATA.shots.length) {
    body.innerHTML = "";
    return;
  }

  body.innerHTML = DATA.shots.map(entry => `
    <tr>
      <td class="opponent-cell">${escapeHTML(entry.player)}</td>
      <td>${escapeHTML(entry.reason)}</td>
      <td>${Number(entry.count) || 0}</td>
      <td>${escapeHTML(entry.date || "Not recorded")}</td>
    </tr>
  `).join("");
}

function renderRules() {
  $("#rulesList").innerHTML = DATA.rules.map(rule => `
    <div class="rule-item">${escapeHTML(rule)}</div>
  `).join("");
}

// =============================================
// PLAYER PROFILES
// =============================================

function openProfile(name) {
  const player = DATA.players.find(
    item => item.name === name
  );

  if (!player) return;

  const dialog = $("#playerDialog");

  $("#playerProfile").innerHTML = `
    <div class="player-avatar profile-avatar">
      ${escapeHTML(initials(player.name))}
    </div>
    <h2 class="profile-name">${escapeHTML(player.name)}</h2>
    <p class="profile-subtitle">
      TEMU BALLERS · ${escapeHTML(player.position)}
    </p>
    <div class="profile-stats">
      <div class="profile-stat">
        <span>Goals</span><strong>${player.goals}</strong>
      </div>
      <div class="profile-stat">
        <span>Assists</span><strong>${player.assists ?? "—"}</strong>
      </div>
      <div class="profile-stat">
        <span>Appearances</span><strong>${player.appearances ?? "—"}</strong>
      </div>
      <div class="profile-stat">
        <span>Shots recorded</span>
        <strong>${DATA.shots
          .filter(entry => entry.player === player.name)
          .reduce((sum, entry) => sum + (Number(entry.count) || 0), 0)}</strong>
      </div>
    </div>
  `;

  dialog.showModal();
}

$("#playersGrid").addEventListener("click", event => {
  const card = event.target.closest("[data-player]");
  if (card) openProfile(card.dataset.player);
});

$("#playerSearch").addEventListener("input", event => {
  renderPlayers(event.target.value);
});

$("#closeDialog").addEventListener("click", () => {
  $("#playerDialog").close();
});

$("#playerDialog").addEventListener("click", event => {
  if (event.target === $("#playerDialog")) {
    $("#playerDialog").close();
  }
});

// =============================================
// INITIALISE WEBSITE
// =============================================

function init() {
  renderOverview();
  renderResults();
  renderFixtures();
  renderPlayers();
  renderLeaderboard("#goalsLeaderboard", "goals", "Goals");
  renderLeaderboard("#assistsLeaderboard", "assists", "Assists");
  renderStatsTable();
  renderShots();
  renderRules();

  $("#year").textContent = new Date().getFullYear();
}

init();
