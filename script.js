// =============================================
// TEMU BALLERS — MATCH CENTRE DATA
// =============================================

const DATA = {
  players: [
    { name: "Josh",    goals: 2, assists: 0, appearances: 2},
    { name: "Ethan",   goals: 0, assists: 0, appearances: 2},
    { name: "Josè",    goals: 0, assists: 0, appearances: 2},
    { name: "Abdou",   goals: 0, assists: 0, appearances: 2},
    { name: "Adam",    goals: 2, assists: 0, appearances: 2},
    { name: "Alex",    goals: 0, assists: 0, appearances: 0},
    { name: "Brandon", goals: 0, assists: 0, appearances: 2},
    { name: "Lathi",   goals: 0, assists: 0, appearances: 2},
    { name: "Zack",    goals: 1, assists: 0, appearances: 1},
    { name: "Manu",    goals: 0, assists: 0, appearances: 0}
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

  // Set assists to a number when confirmed.
  // null means the figure has not been recorded.

  // Record each agreed infraction here.
  // count is the number of shots, not a monetary amount.
  shots: [
    // Example:
    // { player: "Josh", reason: "Missed open goal", count: 1, date: "4 Nov 2026" }
  ],

  rules: [
    "Yellow card — one shot.",
    "Green card — one shot.",
    "Injury — one shot, if confirmed as an agreed rule.",
    "Own goal — one shot.",
    "Not scoring — one shot.",
    "Missing an open goal — one shot.",
    "Finishing below 4th place — everyone takes a shot."
  ]
};

// =============================================
// HELPERS
// =============================================

const $ = selector => document.querySelector(selector);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function initials(name) {
  return name.trim().split(/\s+/)
    .map(part => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function recordedValue(value) {
  return Number.isFinite(value) ? value : "—";
}

// =============================================
// SEASON DASHBOARD
// =============================================

function renderOverview() {
  const wins = DATA.results.filter(match => match.status === "W").length;
  const draws = DATA.results.filter(match => match.status === "D").length;
  const losses = DATA.results.filter(match => match.status === "L").length;

  const goalsFor = DATA.results.reduce(
    (sum, match) => sum + match.team, 0
  );

  const goalsAgainst = DATA.results.reduce(
    (sum, match) => sum + match.opponentScore, 0
  );

  const points = wins * 3 + draws;
  const difference = goalsFor - goalsAgainst;

  $("#matchesPlayed").textContent = formatNumber(DATA.results.length);
  $("#points").textContent = formatNumber(points);
  $("#goalsFor").textContent = formatNumber(goalsFor);
  $("#goalDifference").textContent =
    difference > 0 ? `+${difference}` : String(difference);

  $("#goalsAgainstLabel").textContent =
    `${goalsAgainst} goals conceded`;

  $("#heroRecord").textContent = `${wins}W · ${draws}D · ${losses}L`;
}

// =============================================
// MATCH CENTRE
// =============================================

function renderResults() {
  const container = $("#resultsList");

  if (!DATA.results.length) {
    container.innerHTML =
      '<p class="empty-state">No match results recorded yet.</p>';
    return;
  }

  container.innerHTML = [...DATA.results].reverse().map(match => {
    const status = match.status;
    const label = status === "W" ? "WIN" :
                  status === "D" ? "DRAW" : "LOSS";

    const outcomeClass = status === "W" ? "" :
                         status === "D" ? "outcome-draw" : "outcome-loss";

    const scorers = match.scorers?.length
      ? `GOALS: ${match.scorers.map(escapeHTML).join(" · ")}`
      : "GOALSCORERS NOT RECORDED";

    return `
      <article class="match-card">
        <div class="match-date">
          <strong>${escapeHTML(match.date)}</strong>
          COMPLETED
        </div>

        <div class="matchup">
          <div class="match-team">Temu Ballers</div>
          <div class="match-score">
            ${match.team}<span>–</span>${match.opponentScore}
          </div>
          <div class="match-team">${escapeHTML(match.opponent)}</div>
        </div>

        <div class="match-outcome">
          <span class="outcome-pill ${outcomeClass}">${label}</span>
        </div>

        <div class="match-scorers">${scorers}</div>
      </article>
    `;
  }).join("");
}

// =============================================
// UPCOMING FIXTURES
// =============================================

function renderFixtures() {
  const body = $("#fixturesTable");

  if (!DATA.fixtures.length) {
    body.innerHTML =
      '<tr><td colspan="5">No upcoming fixtures recorded.</td></tr>';
    return;
  }

  body.innerHTML = DATA.fixtures.map(fixture => `
    <tr>
      <td>${escapeHTML(fixture.date)}</td>
      <td>${escapeHTML(fixture.time)}</td>
      <td class="opponent-cell">${escapeHTML(fixture.opponent)}</td>
      <td>${escapeHTML(fixture.venue)}</td>
      <td><span class="status-pill">UPCOMING</span></td>
    </tr>
  `).join("");
}

// =============================================
// PLAYER CARDS
// =============================================

function renderPlayers(search = "") {
  const grid = $("#playersGrid");
  const query = search.trim().toLowerCase();

  const players = DATA.players.filter(player =>
    player.name.toLowerCase().includes(query)
  );

  $("#playerCount").textContent =
    `${DATA.players.length} PLAYERS`;

  if (!players.length) {
    grid.innerHTML =
      '<p class="empty-state">No players match your search.</p>';
    return;
  }

  grid.innerHTML = players.map(player => `
    <button type="button" class="player-card"
      data-player="${escapeHTML(player.name)}"
      aria-label="View ${escapeHTML(player.name)}'s profile">

      <div class="player-card-top">
        <span class="player-avatar">
          ${escapeHTML(initials(player.name))}
        </span>
      </div>

      <div class="player-card-bottom">
        <span class="player-name">${escapeHTML(player.name)}</span>
        <span class="player-position">${escapeHTML(player.position)}</span>

        <div class="player-mini-stats">
          <span><b>${player.goals}</b> GOALS</span>
          <span><b>${recordedValue(player.assists)}</b> ASSISTS</span>
        </div>
      </div>
    </button>
  `).join("");
}

// =============================================
// GOALS AND ASSISTS LEADERBOARDS
// =============================================

function renderLeaderboard(selector, field, label) {
  const container = $(selector);

  // A null value means that the figure is not yet known.
  const recorded = DATA.players.filter(player =>
    Number.isFinite(player[field])
  );

  const ranked = recorded
    .filter(player => player[field] > 0)
    .sort((a, b) =>
      b[field] - a[field] ||
      a.name.localeCompare(b.name)
    );

  if (!ranked.length) {
    const message = field === "assists"
      ? "Assists have not been recorded yet."
      : `No ${label.toLowerCase()} recorded yet.`;

    container.innerHTML =
      `<p class="empty-state">${message}</p>`;
    return;
  }

  const maximum = Math.max(...ranked.map(player => player[field]));

  container.innerHTML = ranked.map((player, index) => `
    <div class="leader-row">
      <span class="leader-rank">${formatNumber(index + 1)}</span>

      <div>
        <div class="leader-name">${escapeHTML(player.name)}</div>
        <div class="leader-bar">
          <span style="width:${player[field] / maximum * 100}%"></span>
        </div>
      </div>

      <span class="leader-total">${player[field]}</span>
    </div>
  `).join("");
}

// =============================================
// SQUAD STATISTICS TABLE
// =============================================

function renderStatsTable() {
  $("#statsTable").innerHTML = DATA.players.map(player => `
    <tr>
      <td>${escapeHTML(player.name)}</td>
      <td>${player.appearances ?? "Unrecorded"}</td>
      <td>${player.goals}</td>
      <td>${player.assists ?? "Unrecorded"}</td>
    </tr>
  `).join("");
}

// =============================================
// SHOTS REGISTER
// =============================================

function renderShots() {
  const body = $("#shotsTable");

  const total = DATA.shots.reduce(
    (sum, entry) => sum + Math.max(0, Number(entry.count) || 0),
    0
  );

  $("#totalShots").textContent = formatNumber(total);
  $("#emptyShots").hidden = DATA.shots.length > 0;

  if (!DATA.shots.length) {
    body.innerHTML = "";
    return;
  }

  body.innerHTML = DATA.shots.map(entry => `
    <tr>
      <td>${escapeHTML(entry.player)}</td>
      <td>${escapeHTML(entry.reason)}</td>
      <td>${Math.max(0, Number(entry.count) || 0)}</td>
      <td>${escapeHTML(entry.date || "Not recorded")}</td>
    </tr>
  `).join("");
}

function renderRules() {
  $("#rulesList").innerHTML = DATA.rules.map((rule, index) => `
    <div class="rule-item">
      <span>${escapeHTML(rule)}</span>
    </div>
  `).join("");
}

// =============================================
// PLAYER PROFILE POP-UP
// =============================================

function openProfile(name) {
  const player = DATA.players.find(item => item.name === name);
  if (!player) return;

  const playerShots = DATA.shots
    .filter(entry => entry.player === player.name)
    .reduce((sum, entry) => sum + (Number(entry.count) || 0), 0);

  $("#playerProfile").innerHTML = `
    <div class="player-avatar profile-avatar-large">
      ${escapeHTML(initials(player.name))}
    </div>

    <h2 class="profile-name">${escapeHTML(player.name)}</h2>
    <p class="profile-subtitle">
      TEMU BALLERS / ${escapeHTML(player.position)}
    </p>

    <div class="profile-stats">
      <div class="profile-stat">
        <span>Goals</span>
        <strong>${player.goals}</strong>
      </div>
      <div class="profile-stat">
        <span>Assists</span>
        <strong>${recordedValue(player.assists)}</strong>
      </div>
      <div class="profile-stat">
        <span>Appearances</span>
        <strong>${recordedValue(player.appearances)}</strong>
      </div>
      <div class="profile-stat">
        <span>Shots recorded</span>
        <strong>${playerShots}</strong>
      </div>
    </div>
  `;

  $("#playerDialog").showModal();
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
// START THE MATCH CENTRE
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
