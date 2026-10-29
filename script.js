
const DATA = {
  players: [
    { name: "Josh", goals: 2, assists: 0, appearances: 2},
    { name: "Ethan", goals: 0, assists: 0, appearances: 2},
    { name: "Josè", goals: 0, assists: 0, appearances: 2},
    { name: "Abdou", goals: 0, assists: 0, appearances: 2},
    { name: "Adam", goals: 2, assists: 0, appearances: 2},
    { name: "Alex", goals: 0, assists: 0, appearances: 1},
    { name: "Brandon", goals: 0, assists: 0, appearances: 2},
    { name: "Lathi", goals: 0, assists: 0, appearances: 2},
    { name: "Zack", goals: 1, assists: 0, appearances: 1},
    { name: "Manu", goals: 0, assists: 0, appearances: 0}
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
    { date: "04 Nov 2026", opponent: "Superstrikers", time: "18:15", venue: "Fairview Action Arena" },
    { date: "11 Nov 2026", opponent: "Depot Utd FC", time: "20:30", venue: "Fairview Action Arena" },
    { date: "18 Nov 2026", opponent: "Von-Boeties FC", time: "19:00", venue: "Fairview Action Arena" },
    { date: "25 Nov 2026", opponent: "Teknology FC", time: "18:15", venue: "Fairview Action Arena" },
    { date: "02 Dec 2026", opponent: "The Unknowns", time: "19:45", venue: "Fairview Action Arena" },
    { date: "09 Dec 2026", opponent: "Quality Control", time: "21:15", venue: "Fairview Action Arena" },
    { date: "16 Dec 2026", opponent: "Toray Logistics", time: "20:30", venue: "Fairview Action Arena" }
  ],

  // Each recorded card currently counts as one shot under the team rules.
  // Dates are left unrecorded because exact incident dates were not supplied.
  fines: [
    { player: "Ethan", incident: "Green card", type: "green", shots: 1, date: "Date not recorded" },
    { player: "Zack", incident: "Green card", type: "green", shots: 1, date: "Date not recorded" },
    { player: "Adam", incident: "Green card", type: "green", shots: 1, date: "Date not recorded" },
    { player: "Brandon", incident: "Green card", type: "green", shots: 1, date: "Date not recorded" },
    { player: "Abdou", incident: "Green card", type: "green", shots: 1, date: "Date not recorded" },
    { player: "Alex", incident: "Yellow card", type: "yellow", shots: 1, date: "Date not recorded" }
  ],

  rules: [
    "Yellow card — one shot under the team rules.",
    "Green card — one shot under the team rules.",
    "Injury — only applies if the team has agreed to this rule.",
    "Own goal — one shot under the team rules.",
    "Not scoring — one shot under the team rules.",
    "Missing an open goal — one shot under the team rules.",
    "Finishing below 4th place — everyone takes a shot."
  ]
};

const $ = (id) => document.getElementById(id);

const escapeHTML = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);

const initials = (name) =>
  name.trim().split(/\s+/).map((part) => part[0]).join("").toUpperCase();

const displayStat = (value) =>
  value === null || value === undefined ? "—" : value;

const totalGoals = DATA.results.reduce((sum, match) => sum + match.team, 0);
const totalConceded = DATA.results.reduce((sum, match) => sum + match.opponentScore, 0);

const wins = DATA.results.filter((match) => match.team > match.opponentScore).length;
const draws = DATA.results.filter((match) => match.team === match.opponentScore).length;
const losses = DATA.results.filter((match) => match.team < match.opponentScore).length;
const points = wins * 3 + draws;

function renderOverview() {
  $("matchesPlayed").textContent = DATA.results.length;
  $("points").textContent = points;
  $("goalsFor").textContent = totalGoals;

  const difference = totalGoals - totalConceded;
  $("goalDifference").textContent = difference > 0 ? `+${difference}` : difference;
  $("goalsAgainstLabel").textContent = `${totalConceded} conceded`;

  $("winsCount").textContent = wins;
  $("drawsCount").textContent = draws;
  $("lossesCount").textContent = losses;

  $("heroRecord").textContent = `${wins}W ${draws}D ${losses}L`;

  $("resultsList").innerHTML = [...DATA.results].reverse().map((match) => {
    const status = match.team > match.opponentScore
      ? "W"
      : match.team === match.opponentScore ? "D" : "L";

    return `
      <div class="result-row">
        <div class="result-team">
          TEMU BALLERS
          <small>${escapeHTML(match.date)}</small>
          <span class="result-status status-${status}">${status === "W" ? "WIN" : status === "D" ? "DRAW" : "LOSS"}</span>
        </div>
        <div class="result-score">
          <span>${match.team}</span>
          <span class="dash">–</span>
          <span>${match.opponentScore}</span>
        </div>
        <div class="result-team">
          ${escapeHTML(match.opponent)}
          <small>FULL TIME</small>
        </div>
      </div>
    `;
  }).join("");

  $("formGuide").innerHTML = DATA.results.length
    ? DATA.results.map((match) => {
        const status = match.team > match.opponentScore
          ? "W"
          : match.team === match.opponentScore ? "D" : "L";

        return `<span class="form-pill ${status}" title="${status === "W" ? "Win" : status === "D" ? "Draw" : "Loss"}">${status}</span>`;
      }).join("")
    : `<div class="empty-state">No results recorded yet.</div>`;
}

function renderPlayers(searchTerm = "") {
  const filteredPlayers = DATA.players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  $("playerCount").textContent = DATA.players.length;

  $("playersGrid").innerHTML = filteredPlayers.length
    ? filteredPlayers.map((player) => `
      <button class="player-card" type="button" data-player="${escapeHTML(player.name)}" aria-label="View ${escapeHTML(player.name)}'s profile">
        <span class="player-avatar">${escapeHTML(initials(player.name))}</span>
        <span class="player-name">${escapeHTML(player.name)}</span>
        <span class="player-position">${escapeHTML(player.position)}</span>
        <span class="player-mini-stats">
          <span><strong>${displayStat(player.goals)}</strong>Goals</span>
          <span><strong>${displayStat(player.assists)}</strong>Assists</span>
          <span><strong>${displayStat(player.appearances)}</strong>Apps</span>
        </span>
      </button>
    `).join("")
    : `<div class="empty-state">No players match your search.</div>`;

  $("playersGrid").querySelectorAll("[data-player]").forEach((button) => {
    button.addEventListener("click", () => openPlayerProfile(button.dataset.player));
  });
}

function renderLeaderboard(elementId, statName) {
  const players = [...DATA.players].sort((a, b) => {
    const aValue = a[statName];
    const bValue = b[statName];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    return bValue - aValue || a.name.localeCompare(b.name);
  });

  const hasRecordedValues = players.some((player) =>
    player[statName] !== null && player[statName] !== undefined
  );

  if (!hasRecordedValues) {
    $(elementId).innerHTML = `
      <div class="empty-state">
        No ${statName === "goals" ? "goal" : "assist"} records available yet.
      </div>
    `;
    return;
  }

  $(elementId).innerHTML = players.map((player, index) => {
    const value = player[statName];
    const recorded = value !== null && value !== undefined;

    return `
      <div class="leader-row">
        <span class="leader-rank">${String(index + 1).padStart(2, "0")}</span>
        <span class="leader-player">
          <strong>${escapeHTML(player.name)}</strong>
          <small>${recorded ? "Season total" : "Not recorded"}</small>
        </span>
        <span class="leader-value ${recorded ? "" : "unrecorded"}">${displayStat(value)}</span>
      </div>
    `;
  }).join("");
}

function renderPlayerStats() {
  $("statsTable").innerHTML = DATA.players.map((player) => `
    <tr>
      <td>${escapeHTML(player.name)}</td>
      <td>${displayStat(player.appearances)}</td>
      <td>${displayStat(player.goals)}</td>
      <td>${displayStat(player.assists)}</td>
    </tr>
  `).join("");
}

function renderFixtures() {
  $("fixturesTable").innerHTML = DATA.fixtures.map((fixture) => `
    <tr>
      <td class="fixture-date">${escapeHTML(fixture.date)}</td>
      <td class="fixture-opponent">${escapeHTML(fixture.opponent)}</td>
      <td>${escapeHTML(fixture.time)}</td>
      <td class="fixture-venue">${escapeHTML(fixture.venue)}</td>
    </tr>
  `).join("");
}

function renderFines() {
  const greenCount = DATA.fines.filter((fine) => fine.type === "green").length;
  const yellowCount = DATA.fines.filter((fine) => fine.type === "yellow").length;
  const shotCount = DATA.fines.reduce((sum, fine) => sum + fine.shots, 0);

  $("totalFines").textContent = DATA.fines.length;
  $("greenCards").textContent = greenCount;
  $("yellowCards").textContent = yellowCount;
  $("totalShots").textContent = shotCount;

  $("finesTable").innerHTML = DATA.fines.length
    ? DATA.fines.map((fine) => `
      <tr>
        <td>${escapeHTML(fine.player)}</td>
        <td>
          <span class="card-type">
            <span class="card-dot ${escapeHTML(fine.type)}"></span>
            ${escapeHTML(fine.incident)}
          </span>
        </td>
        <td><span class="shot-status">${fine.shots} ${fine.shots === 1 ? "shot" : "shots"}</span></td>
        <td>${escapeHTML(fine.date)}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="4">No incidents recorded yet.</td></tr>`;

  $("rulesList").innerHTML = DATA.rules.map((rule, index) => `
    <div class="rule-item">
      <span class="rule-number">${String(index + 1).padStart(2, "0")}</span>
      <span>${escapeHTML(rule)}</span>
    </div>
  `).join("");
}

function openPlayerProfile(playerName) {
  const player = DATA.players.find((item) => item.name === playerName);
  if (!player) return;

  $("playerProfile").innerHTML = `
    <div class="profile-header">
      <span class="player-avatar">${escapeHTML(initials(player.name))}</span>
      <div>
        <p class="eyebrow">TEMU BALLERS • PLAYER PROFILE</p>
        <h3>${escapeHTML(player.name)}</h3>
        <p>${escapeHTML(player.position)}</p>
      </div>
    </div>
    <div class="profile-stats">
      <div class="profile-stat">
        <strong>${displayStat(player.appearances)}</strong>
        <span>Appearances</span>
      </div>
      <div class="profile-stat">
        <strong>${displayStat(player.goals)}</strong>
        <span>Goals</span>
      </div>
      <div class="profile-stat">
        <strong>${displayStat(player.assists)}</strong>
        <span>Assists</span>
      </div>
    </div>
    <p class="table-note">Player statistics are based on the records currently entered for the season.</p>
  `;

  const dialog = $("playerDialog");
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function initialiseWebsite() {
  renderOverview();
  renderPlayers();
  renderLeaderboard("goalsLeaderboard", "goals");
  renderLeaderboard("assistsLeaderboard", "assists");
  renderPlayerStats();
  renderFixtures();
  renderFines();

  $("playerSearch").addEventListener("input", (event) => {
    renderPlayers(event.target.value);
  });

  $("closeDialog").addEventListener("click", () => {
    $("playerDialog").close();
  });

  $("playerDialog").addEventListener("click", (event) => {
    if (event.target === $("playerDialog")) {
      $("playerDialog").close();
    }
  });
}

document.addEventListener("DOMContentLoaded", initialiseWebsite);
