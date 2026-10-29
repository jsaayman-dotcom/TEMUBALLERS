
/* =========================================================
   TEMU BALLERS — BLACK & ORANGE WEBSITE
   File: script.js
   ========================================================= */

"use strict";

/* =========================================================
   1. TEAM DATA
   Update player statistics here as the season progresses.
   Use null for information that has not been recorded.
   ========================================================= */

const teamData = {
  name: "Temu Ballers",

  players: [
    { name: "Josh", goals: 2, assists: null, appearances: 2, green: 0, yellow: 0 },
    { name: "Ethan", goals: 0, assists: 1, appearances: 2, green: 1, yellow: 0 },
    { name: "Jose", goals: 0, assists: 2, appearances: 2, green: 0, yellow: 0 },
    { name: "Abdou", goals: 0, assists: null, appearances: 2, green: 0, yellow: 0 },
    { name: "Adam", goals: 2, assists: null, appearances: 2, green: 2, yellow: 0 },
    { name: "Alex", goals: 0, assists: null, appearances: null, green: 0, yellow: 0 },
    { name: "Brandon", goals: 0, assists: null, appearances: 2, green: 0, yellow: 0 },
    { name: "Lathi", goals: 0, assists: null, appearances: null, green: 0, yellow: 0 },
    { name: "Zach", goals: 1, assists: null, appearances: 2, green: 1, yellow: 1 },
    { name: "Manu", goals: 0, assists: null, appearances: null, green: 0, yellow: 0 }
  ],

  results: [
    {
      date: null,
      opponent: "Dark Knights",
      teamScore: 3,
      opponentScore: 3,
      scorers: ["Josh", "Zach", "Adam"]
    },
    {
      date: null,
      opponent: "FC Sparta",
      teamScore: 2,
      opponentScore: 1,
      scorers: ["Josh", "Adam"]
    }
  ],

  fixtures: [
    { date: "2026-11-04", time: "18:15", opponent: "Superstrikers", venue: "Fairview Action Arena" },
    { date: "2026-11-11", time: "20:30", opponent: "Depot Utd FC", venue: "Fairview Action Arena" },
    { date: "2026-11-18", time: "19:00", opponent: "Von-Boeties FC", venue: "Fairview Action Arena" },
    { date: "2026-11-25", time: "18:15", opponent: "Teknology FC", venue: "Fairview Action Arena" },
    { date: "2026-12-02", time: "19:45", opponent: "The Unknowns", venue: "Fairview Action Arena" },
    { date: "2026-12-09", time: "21:15", opponent: "Quality Control", venue: "Fairview Action Arena" },
    { date: "2026-12-16", time: "20:30", opponent: "Toray Logistics", venue: "Fairview Action Arena" }
  ],

  injuries: [
    { player: "Alex", description: "Ear injury", status: "Reported" }
  ],

  rules: [
    { title: "Yellow card", description: "One shot under the team rules." },
    { title: "Green card", description: "One shot under the team rules." },
    { title: "Own goal", description: "One shot under the team rules." },
    { title: "Not scoring", description: "One shot under the team rules." },
    { title: "Missing an open goal", description: "One shot under the team rules." },
    { title: "Finishing below 4th", description: "Everyone takes a shot." },
    { title: "Injury rule", description: "Only applies if the team has agreed to this rule." }
  ],

  teamOfWeek: {
    gameweek: 1,
    player: "Jose"
  }
};


/* =========================================================
   2. HELPER FUNCTIONS
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function displayValue(value) {
  return value === null || value === undefined || value === ""
    ? "—"
    : String(value);
}

function formatDate(dateString) {
  if (!dateString) return "Date not recorded";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Date not recorded";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatShortDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function signedNumber(number) {
  return number > 0 ? `+${number}` : String(number);
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resultType(result) {
  if (result.teamScore > result.opponentScore) return "win";
  if (result.teamScore < result.opponentScore) return "loss";
  return "draw";
}

function resultLabel(type) {
  return {
    win: "WIN",
    draw: "DRAW",
    loss: "LOSS"
  }[type];
}


/* =========================================================
   3. CALCULATE TEAM STATISTICS
   ========================================================= */

function getTeamStats() {
  const played = teamData.results.length;

  const wins = teamData.results.filter(
    result => resultType(result) === "win"
  ).length;

  const draws = teamData.results.filter(
    result => resultType(result) === "draw"
  ).length;

  const losses = teamData.results.filter(
    result => resultType(result) === "loss"
  ).length;

  const goalsFor = teamData.results.reduce(
    (total, result) => total + result.teamScore,
    0
  );

  const goalsAgainst = teamData.results.reduce(
    (total, result) => total + result.opponentScore,
    0
  );

  const greenCards = teamData.players.reduce(
    (total, player) => total + player.green,
    0
  );

  const yellowCards = teamData.players.reduce(
    (total, player) => total + player.yellow,
    0
  );

  return {
    played,
    wins,
    draws,
    losses,
    points: wins * 3 + draws,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    greenCards,
    yellowCards,
    totalShots: greenCards + yellowCards,
    injuryCount: teamData.injuries.length,
    playerCount: teamData.players.length
  };
}


/* =========================================================
   4. SEASON OVERVIEW
   ========================================================= */

function renderOverview() {
  const stats = getTeamStats();

  setText("heroRecord", `${stats.wins}–${stats.draws}–${stats.losses}`);
  setText("points", stats.points);
  setText("overviewPoints", stats.points);
  setText("heroGoals", stats.goalsFor);
  setText("heroGoalDifference", signedNumber(stats.goalDifference));

  setText("matchesPlayed", stats.played);
  setText("goalsFor", stats.goalsFor);
  setText("goalDifference", signedNumber(stats.goalDifference));

  setText("greenCards", stats.greenCards);
  setText("yellowCards", stats.yellowCards);
  setText("totalShots", stats.totalShots);
  setText("injuryCount", stats.injuryCount);

  setText("playerCount", `${stats.playerCount} PLAYERS`);
  setText("statsPlayerCount", `${stats.playerCount} PLAYERS`);
  setText(
    "resultsCount",
    `${stats.played} ${stats.played === 1 ? "MATCH" : "MATCHES"}`
  );

  renderForm();
}


/* =========================================================
   5. RECENT FORM
   ========================================================= */

function renderForm() {
  const container = $("#formGuide");
  if (!container) return;

  const recentResults = [...teamData.results].reverse();

  if (!recentResults.length) {
    container.innerHTML = '<p class="empty-state">No results recorded yet.</p>';
    return;
  }

  container.innerHTML = recentResults.map(result => {
    const type = resultType(result);
    const letter = { win: "W", draw: "D", loss: "L" }[type];

    return `
      <span
        class="form-result form-${type}"
        title="${escapeHTML(resultLabel(type))} vs ${escapeHTML(result.opponent)}"
      >${letter}</span>
    `;
  }).join("");
}


/* =========================================================
   6. RESULTS
   ========================================================= */

function renderResults() {
  const container = $("#resultsList");
  if (!container) return;

  if (!teamData.results.length) {
    container.innerHTML = `
      <p class="empty-state">No matches have been recorded yet.</p>
    `;
    return;
  }

  container.innerHTML = [...teamData.results].reverse().map(result => {
    const type = resultType(result);

    const scorers = result.scorers.length
      ? result.scorers.map(escapeHTML).join(" · ")
      : "Not recorded";

    return `
      <article class="result-card">
        <div class="result-date">
          <span class="result-date-day">${escapeHTML(formatShortDate(result.date))}</span>
          <span>${escapeHTML(formatDate(result.date))}</span>
        </div>

        <div class="result-match">
          <div class="result-team">
            <span class="team-emblem">TB</span>
            <strong>Temu Ballers</strong>
          </div>

          <div class="score-display">
            <strong>${result.teamScore}</strong>
            <span>:</span>
            <strong>${result.opponentScore}</strong>
          </div>

          <div class="result-team opponent-team">
            <strong>${escapeHTML(result.opponent)}</strong>
            <span class="opponent-emblem">${escapeHTML(initials(result.opponent))}</span>
          </div>
        </div>

        <div class="result-details">
          <span class="result-status status-${type}">${resultLabel(type)}</span>
          <p><span>GOAL SCORERS</span> ${scorers}</p>
        </div>
      </article>
    `;
  }).join("");
}


/* =========================================================
   7. SQUAD CARDS
   ========================================================= */

function renderPlayers(searchTerm = "") {
  const container = $("#playersGrid");
  if (!container) return;

  const query = searchTerm.trim().toLowerCase();

  const players = teamData.players.filter(player =>
    player.name.toLowerCase().includes(query)
  );

  setText(
    "playerCount",
    `${players.length} ${players.length === 1 ? "PLAYER" : "PLAYERS"}`
  );

  setText("statsPlayerCount", `${teamData.players.length} PLAYERS`);

  const emptyMessage = $("#noPlayersMessage");
  if (emptyMessage) emptyMessage.hidden = players.length !== 0;

  container.innerHTML = players.map(player => {
    const squadNumber = teamData.players.indexOf(player) + 1;

    return `
      <article
        class="player-card"
        data-player="${escapeHTML(player.name)}"
        tabindex="0"
        role="button"
        aria-label="Open ${escapeHTML(player.name)}'s profile"
      >
        <div class="player-card-top">
          <span class="player-initials">${escapeHTML(initials(player.name))}</span>
          <span class="player-number">${String(squadNumber).padStart(2, "0")}</span>
        </div>

        <h3>${escapeHTML(player.name)}</h3>
        <p class="player-role">Squad member</p>

        <div class="player-card-stats">
          <div>
            <strong>${player.goals}</strong>
            <span>Goals</span>
          </div>
          <div>
            <strong>${displayValue(player.appearances)}</strong>
            <span>Apps</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setupPlayerSearch() {
  const input = $("#playerSearch");
  if (!input) return;

  input.addEventListener("input", event => {
    renderPlayers(event.target.value);
  });
}


/* =========================================================
   8. PLAYER PROFILE
   ========================================================= */

function openPlayerProfile(playerName) {
  const player = teamData.players.find(
    item => item.name === playerName
  );

  if (!player) return;

  const dialog = $("#playerDialog");
  const profile = $("#playerProfile");

  if (!dialog || !profile) return;

  const goalContributions =
    player.assists === null ? null : player.goals + player.assists;

  profile.innerHTML = `
    <div class="profile-header">
      <span class="player-initials profile-initials">${escapeHTML(initials(player.name))}</span>
      <div>
        <h2>${escapeHTML(player.name)}</h2>
        <p>Temu Ballers · Squad member</p>
      </div>
    </div>

    <div class="profile-stats">
      <div class="profile-stat">
        <strong>${player.goals}</strong>
        <span>Goals</span>
      </div>

      <div class="profile-stat">
        <strong>${displayValue(player.assists)}</strong>
        <span>Assists</span>
      </div>

      <div class="profile-stat">
        <strong>${displayValue(player.appearances)}</strong>
        <span>Appearances</span>
      </div>

      <div class="profile-stat">
        <strong>${displayValue(goalContributions)}</strong>
        <span>Goal contributions</span>
      </div>

      <div class="profile-stat">
        <strong>${player.green}</strong>
        <span>Green cards</span>
      </div>

      <div class="profile-stat">
        <strong>${player.yellow}</strong>
        <span>Yellow cards</span>
      </div>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function setupPlayerProfiles() {
  const grid = $("#playersGrid");
  const dialog = $("#playerDialog");
  const closeButton = $("#closeDialog");

  if (grid) {
    grid.addEventListener("click", event => {
      const card = event.target.closest("[data-player]");
      if (card) openPlayerProfile(card.dataset.player);
    });

    grid.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const card = event.target.closest("[data-player]");
      if (!card) return;

      event.preventDefault();
      openPlayerProfile(card.dataset.player);
    });
  }

  if (closeButton && dialog) {
    closeButton.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });
  }

  if (dialog) {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (outside && typeof dialog.close === "function") {
        dialog.close();
      }
    });
  }
}


/* =========================================================
   9. LEADERBOARDS
   Every player is shown, including players with zero stats.
   Unknown assists remain "—", not zero.
   ========================================================= */

function renderLeaderboard(containerId, statistic, label) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const players = [...teamData.players].sort((a, b) => {
    const aValue = a[statistic];
    const bValue = b[statistic];

    // Players with recorded numbers are ranked before unknown values.
    if (aValue === null && bValue !== null) return 1;
    if (aValue !== null && bValue === null) return -1;

    if (aValue !== null && bValue !== null && bValue !== aValue) {
      return bValue - aValue;
    }

    return a.name.localeCompare(b.name);
  });

  container.innerHTML = players.map((player, index) => {
    const value = displayValue(player[statistic]);

    return `
      <div class="leaderboard-row">
        <span class="leader-rank">${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHTML(player.name)}</strong>
        <span class="leader-value">${value}</span>
      </div>
    `;
  }).join("");
}

function renderLeaderboards() {
  renderLeaderboard("goalsLeaderboard", "goals", "Goals");
  renderLeaderboard("assistsLeaderboard", "assists", "Assists");
}


/* =========================================================
   10. FULL SQUAD STATISTICS TABLE
   All 10 players are included.
   ========================================================= */

function renderStatsTable() {
  const container = $("#statsTable");
  if (!container) return;

  const sortedPlayers = [...teamData.players].sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;

    const aAssists = a.assists ?? -1;
    const bAssists = b.assists ?? -1;

    if (bAssists !== aAssists) return bAssists - aAssists;

    return a.name.localeCompare(b.name);
  });

  container.innerHTML = sortedPlayers.map((player, index) => {
    const contributions =
      player.assists === null ? null : player.goals + player.assists;

    return `
      <tr>
        <td>${String(index + 1).padStart(2, "0")}</td>
        <td>${escapeHTML(player.name)}</td>
        <td>${displayValue(player.appearances)}</td>
        <td>${player.goals}</td>
        <td>${displayValue(player.assists)}</td>
        <td>${displayValue(contributions)}</td>
      </tr>
    `;
  }).join("");
}


/* =========================================================
   11. TEAM OF THE WEEK
   ========================================================= */

function renderTeamOfWeek() {
  setText("teamOfWeekPlayer", teamData.teamOfWeek.player);

  const label = $(".totw-label");
  if (label) {
    label.textContent = `GAMEWEEK ${teamData.teamOfWeek.gameweek}`;
  }
}


/* =========================================================
   12. FIXTURES
   ========================================================= */

function renderFixtures() {
  const container = $("#fixturesTable");
  if (!container) return;

  // Use local calendar dates to determine whether a fixture is in the past.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  container.innerHTML = teamData.fixtures.map(fixture => {
    const [year, month, day] = fixture.date.split("-").map(Number);
    const fixtureDate = new Date(year, month - 1, day);
    const isPast = fixtureDate < today;

    return `
      <tr>
        <td>${escapeHTML(formatDate(fixture.date))}</td>
        <td>${escapeHTML(fixture.time)}</td>
        <td>${escapeHTML(fixture.opponent)}</td>
        <td>${escapeHTML(fixture.venue)}</td>
        <td>
          <span class="table-status">
            ${isPast ? "Result to be updated" : "Upcoming"}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}


/* =========================================================
   13. DISCIPLINE REGISTER
   ========================================================= */

function renderDiscipline() {
  const container = $("#finesTable");
  if (!container) return;

  const playersWithCards = teamData.players.filter(
    player => player.green > 0 || player.yellow > 0
  );

  if (!playersWithCards.length) {
    container.innerHTML = `
      <tr><td colspan="4">No cards recorded.</td></tr>
    `;
    return;
  }

  container.innerHTML = playersWithCards.map(player => `
    <tr>
      <td>${escapeHTML(player.name)}</td>
      <td>${player.green}</td>
      <td>${player.yellow}</td>
      <td>—</td>
    </tr>
  `).join("");
}


/* =========================================================
   14. INJURY REGISTER
   ========================================================= */

function renderInjuries() {
  const container = $("#injuriesList");
  if (!container) return;

  if (!teamData.injuries.length) {
    container.innerHTML = `
      <p class="empty-state">No injuries recorded.</p>
    `;
    return;
  }

  container.innerHTML = teamData.injuries.map(injury => `
    <div class="injury-row">
      <span class="injury-indicator"></span>
      <div>
        <strong>${escapeHTML(injury.player)}</strong>
        <p>${escapeHTML(injury.description)}</p>
      </div>
      <span class="injury-status">${escapeHTML(injury.status)}</span>
    </div>
  `).join("");
}


/* =========================================================
   15. TEAM RULES
   ========================================================= */

function renderRules() {
  const container = $("#rulesList");
  if (!container) return;

  container.innerHTML = teamData.rules.map((rule, index) => `
    <article class="rule-card${index === teamData.rules.length - 1 ? " rule-card-wide" : ""}">
      <span class="rule-number">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${escapeHTML(rule.title)}</h3>
        <p>${escapeHTML(rule.description)}</p>
      </div>
    </article>
  `).join("");
}


/* =========================================================
   16. MOBILE NAVIGATION
   ========================================================= */

function setupMobileNavigation() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );
  });

  $$(".nav-link", nav).forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });
}


/* =========================================================
   17. ACTIVE NAVIGATION
   ========================================================= */

function setupActiveNavigation() {
  const links = $$(".nav-link");

  const sections = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visible.length) return;

    const currentId = visible[0].target.id;

    links.forEach(link => {
      const active = link.getAttribute("href") === `#${currentId}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0, 0.1, 0.25, 0.5]
  });

  sections.forEach(section => observer.observe(section));
}


/* =========================================================
   18. FOOTER
   ========================================================= */

function renderFooter() {
  setText("currentYear", new Date().getFullYear());
}


/* =========================================================
   19. START WEBSITE
   ========================================================= */

function initialiseWebsite() {
  renderOverview();
  renderResults();
  renderPlayers();
  renderLeaderboards();
  renderStatsTable();
  renderTeamOfWeek();
  renderFixtures();
  renderDiscipline();
  renderInjuries();
  renderRules();
  renderFooter();

  setupPlayerSearch();
  setupPlayerProfiles();
  setupMobileNavigation();
  setupActiveNavigation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseWebsite);
} else {
  initialiseWebsite();
}
