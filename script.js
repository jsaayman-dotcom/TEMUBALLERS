
"use strict";

/* =========================================
   TEMU BALLERS — CENTRAL SEASON DATA
   Update the values here as the season grows.
   ========================================= */

const TEAM = {
  name: "Temu Ballers",
  season: 2026,
  venue: "Fairview Action Arena",

  players: [
    { name: "Josh", goals: 2, assists: 0, appearances: 2, green: 0, yellow: 0 },
    { name: "Ethan", goals: 0, assists: 1, appearances: 2, green: 1, yellow: 0 },
    { name: "Jose", goals: 0, assists: 2, appearances: 2, green: 0, yellow: 0 },
    { name: "Abdou", goals: 0, assists: 0, appearances: 2, green: 0, yellow: 0 },
    { name: "Adam", goals: 2, assists: 0, appearances: 2, green: 2, yellow: 0 },
    { name: "Alex", goals: 0, assists: 0, appearances: 0, green: 0, yellow: 0 },
    { name: "Brandon", goals: 0, assists: 0, appearances: 2, green: 0, yellow: 0 },
    { name: "Lathi", goals: 0, assists: 0, appearances: 0, green: 0, yellow: 0 },
    { name: "Zach", goals: 1, assists: 0, appearances: 2, green: 1, yellow: 1 },
    { name: "Manu", goals: 0, assists: 0, appearances: 0, green: 0, yellow: 0 }
  ],

  // Oldest result first. The last result is treated as the latest.
  // Dates are omitted because confirmed dates were not supplied.
  results: [
    {
      opponent: "Dark Knights",
      teamGoals: 3,
      opponentGoals: 3,
      outcome: "Draw",
      scorers: ["Josh", "Zach", "Adam"]
    },
    {
      opponent: "FC Sparta",
      teamGoals: 2,
      opponentGoals: 1,
      outcome: "Win",
      scorers: ["Josh", "Adam"]
    }
  ],

  fixtures: [
    { date: "2026-11-04", time: "18:15", opponent: "Superstrikers" },
    { date: "2026-11-11", time: "20:30", opponent: "Depot Utd FC" },
    { date: "2026-11-18", time: "19:00", opponent: "Von-Boeties FC" },
    { date: "2026-11-25", time: "18:15", opponent: "Teknology FC" },
    { date: "2026-12-02", time: "19:45", opponent: "The Unknowns" },
    { date: "2026-12-09", time: "21:15", opponent: "Quality Control" },
    { date: "2026-12-16", time: "20:30", opponent: "Toray Logistics" }
  ],

  injuries: [
    { name: "Alex", injury: "Ear injury", status: "Reported" }
  ],

  teamOfTheWeek: {
    player: "Jose",
    gameweek: 1
  },

  rules: [
    "Receiving a yellow card results in one shot.",
    "Receiving a green card results in one shot.",
    "Scoring an own goal results in one shot.",
    "Not scoring results in one shot.",
    "Missing an open goal results in one shot.",
    "Finishing below 4th place means everyone takes a shot.",
    "The injury rule applies only if the team agrees."
  ],

  // No actual fine amounts have been provided.
  // Keep these at zero until real values are recorded.
  fines: {
    Josh: 0,
    Ethan: 0,
    Jose: 0,
    Abdou: 0,
    Adam: 0,
    Alex: 0,
    Brandon: 0,
    Lathi: 0,
    Zach: 0,
    Manu: 0
  }
};


/* =========================================
   HELPERS
   ========================================= */

const $ = (selector) => document.querySelector(selector);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sum(items, property) {
  return items.reduce((total, item) => total + number(item[property]), 0);
}

function initials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  // Construct from local calendar parts to avoid UTC date shifts.
  const date = new Date(year, month - 1, day);

  return {
    weekday: new Intl.DateTimeFormat("en-ZA", {
      weekday: "short"
    }).format(date),

    short: new Intl.DateTimeFormat("en-ZA", {
      day: "2-digit",
      month: "short"
    }).format(date),

    full: new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date)
  };
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = String(value);
}

function outcomeClass(outcome) {
  const value = String(outcome).toLowerCase();

  if (value === "win") return "result-win";
  if (value === "draw") return "result-draw";
  if (value === "loss") return "result-loss";

  return "";
}

function getSeasonTotals() {
  const played = TEAM.results.length;

  const wins = TEAM.results.filter((match) =>
    match.teamGoals > match.opponentGoals
  ).length;

  const draws = TEAM.results.filter((match) =>
    match.teamGoals === match.opponentGoals
  ).length;

  const losses = TEAM.results.filter((match) =>
    match.teamGoals < match.opponentGoals
  ).length;

  const goalsFor = sum(TEAM.results, "teamGoals");
  const goalsAgainst = sum(TEAM.results, "opponentGoals");
  const goalDifference = goalsFor - goalsAgainst;

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points: wins * 3 + draws
  };
}


/* =========================================
   SEASON OVERVIEW
   ========================================= */

function renderSeasonStats() {
  const totals = getSeasonTotals();

  const stats = [
    { label: "Matches played", value: totals.played, note: "Games completed" },
    { label: "Wins", value: totals.wins, note: "Three points each", accent: true },
    { label: "Draws", value: totals.draws, note: "One point each" },
    { label: "Losses", value: totals.losses, note: "Matches lost" },
    { label: "Goals scored", value: totals.goalsFor, note: "Team goals", accent: true },
    {
      label: "Goal difference",
      value: totals.goalDifference > 0
        ? `+${totals.goalDifference}`
        : String(totals.goalDifference),
      note: `${totals.goalsAgainst} goals conceded`
    }
  ];

  const container = $("#seasonStats");
  if (!container) return;

  container.innerHTML = stats.map((stat) => `
    <article class="season-stat">
      <span class="season-stat-label">${escapeHTML(stat.label)}</span>
      <strong class="season-stat-value ${stat.accent ? "accent" : ""}">
        ${escapeHTML(stat.value)}
      </strong>
      <span class="season-stat-note">${escapeHTML(stat.note)}</span>
    </article>
  `).join("");
}


/* =========================================
   MATCH CENTRE
   ========================================= */

function renderMatchup(match) {
  const teamGoals = number(match.teamGoals);
  const opponentGoals = number(match.opponentGoals);

  const scorers = Array.isArray(match.scorers) && match.scorers.length
    ? match.scorers.map(escapeHTML).join(", ")
    : "No scorers recorded";

  return `
    <div class="matchup">
      <div class="match-team">
        <span class="team-monogram">TB</span>
        <span class="match-team-name">${escapeHTML(TEAM.name)}</span>
      </div>

      <div class="match-score" aria-label="${teamGoals} to ${opponentGoals}">
        <span>${teamGoals}</span>
        <span class="score-separator">:</span>
        <span>${opponentGoals}</span>
      </div>

      <div class="match-team">
        <span class="team-monogram">${escapeHTML(initials(match.opponent))}</span>
        <span class="match-team-name">${escapeHTML(match.opponent)}</span>
      </div>
    </div>

    <p class="match-scorers">
      <strong>Goals:</strong> ${scorers}
    </p>
  `;
}

function renderLatestResult() {
  const container = $("#latestResult");
  if (!container) return;

  const latest = TEAM.results[TEAM.results.length - 1];

  if (!latest) {
    container.innerHTML = `
      <p class="no-records">No match results have been recorded yet.</p>
    `;
    return;
  }

  container.innerHTML = `
    ${renderMatchup(latest)}
    <p class="match-meta">Full-time result · ${escapeHTML(latest.outcome)}</p>
  `;
}

function renderNextFixture() {
  const container = $("#nextFixture");
  if (!container) return;

  // Use the next upcoming fixture based on the South African calendar.
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const next = TEAM.fixtures
    .map((fixture) => ({
      ...fixture,
      parsedDate: new Date(
        Number(fixture.date.slice(0, 4)),
        Number(fixture.date.slice(5, 7)) - 1,
        Number(fixture.date.slice(8, 10))
      )
    }))
    .filter((fixture) => fixture.parsedDate >= today)
    .sort((a, b) => a.parsedDate - b.parsedDate)[0];

  if (!next) {
    container.innerHTML = `
      <h3 class="fixture-opponent">No upcoming fixtures</h3>
      <p class="fixture-venue">Check back when the next schedule is added.</p>
    `;
    return;
  }

  const date = formatDate(next.date);

  container.innerHTML = `
    <p class="fixture-date-large">${escapeHTML(date.short)}</p>
    <h3 class="fixture-opponent">${escapeHTML(next.opponent)}</h3>
    <p class="fixture-time">${escapeHTML(date.full)} · ${escapeHTML(next.time)}</p>
    <p class="fixture-venue">${escapeHTML(TEAM.venue)}</p>
  `;
}

function renderResultsTable() {
  const container = $("#resultsTable");
  if (!container) return;

  const results = [...TEAM.results].reverse();

  if (!results.length) {
    container.innerHTML = `
      <tr><td colspan="4">No results recorded yet.</td></tr>
    `;
    return;
  }

  container.innerHTML = results.map((match) => {
    const result = `${number(match.teamGoals)} – ${number(match.opponentGoals)}`;
    const scorers = match.scorers.length
      ? match.scorers.join(", ")
      : "None recorded";

    return `
      <tr>
        <td class="opponent-name">${escapeHTML(match.opponent)}</td>
        <td class="result-score ${outcomeClass(match.outcome)}">${escapeHTML(result)}</td>
        <td><span class="${outcomeClass(match.outcome)}">${escapeHTML(match.outcome)}</span></td>
        <td class="result-scorers">${escapeHTML(scorers)}</td>
      </tr>
    `;
  }).join("");
}

function renderFixturesTable() {
  const container = $("#fixturesTable");
  if (!container) return;

  const fixtures = [...TEAM.fixtures].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  if (!fixtures.length) {
    container.innerHTML = `
      <tr><td colspan="4">No upcoming fixtures recorded.</td></tr>
    `;
    return;
  }

  container.innerHTML = fixtures.map((fixture) => {
    const date = formatDate(fixture.date);

    return `
      <tr>
        <td>
          <strong>${escapeHTML(date.short)}</strong>
          <span class="subtle-label"> · ${escapeHTML(date.weekday)}</span>
        </td>
        <td>${escapeHTML(fixture.time)}</td>
        <td class="opponent-name">${escapeHTML(fixture.opponent)}</td>
        <td class="venue-cell">${escapeHTML(TEAM.venue)}</td>
      </tr>
    `;
  }).join("");
}

function renderMatches() {
  renderLatestResult();
  renderNextFixture();
  renderResultsTable();
  renderFixturesTable();
}


/* =========================================
   SQUAD & PLAYER PROFILES
   ========================================= */

function renderPlayers(searchTerm = "") {
  const container = $("#playersGrid");
  if (!container) return;

  const term = searchTerm.trim().toLowerCase();

  const filtered = TEAM.players.filter((player) =>
    player.name.toLowerCase().includes(term)
  );

  setText("#playerCount", `${filtered.length} PLAYER${filtered.length === 1 ? "" : "S"}`);

  container.innerHTML = filtered.map((player) => `
    <article
      class="player-card"
      tabindex="0"
      role="button"
      data-player="${escapeHTML(player.name)}"
      aria-label="View ${escapeHTML(player.name)}'s profile"
    >
      <div class="player-avatar">${escapeHTML(initials(player.name))}</div>
      <h3 class="player-name">${escapeHTML(player.name)}</h3>
      <span class="player-subtitle">Temu Ballers</span>

      <div class="player-mini-stats">
        <div class="player-mini-stat">
          <strong>${number(player.goals)}</strong>
          <span>Goals</span>
        </div>
        <div class="player-mini-stat">
          <strong>${number(player.assists)}</strong>
          <span>Assists</span>
        </div>
        <div class="player-mini-stat">
          <strong>${number(player.appearances)}</strong>
          <span>Apps</span>
        </div>
      </div>

      <span class="player-card-cta">View profile ↗</span>
    </article>
  `).join("");

  const empty = $("#playersEmpty");
  if (empty) empty.hidden = filtered.length !== 0;
}

function openPlayerProfile(name) {
  const player = TEAM.players.find((item) => item.name === name);
  if (!player) return;

  const dialog = $("#playerDialog");
  const profile = $("#playerProfile");

  if (!dialog || !profile) return;

  profile.innerHTML = `
    <div class="dialog-player-top">
      <div class="player-avatar">${escapeHTML(initials(player.name))}</div>
      <p class="eyebrow">TEMU BALLERS · PLAYER PROFILE</p>
      <h2>${escapeHTML(player.name)}</h2>
      <p>Season ${TEAM.season}</p>
    </div>

    <div class="profile-stat-grid">
      <div class="profile-stat">
        <strong>${number(player.appearances)}</strong>
        <span>Appearances</span>
      </div>
      <div class="profile-stat">
        <strong>${number(player.goals)}</strong>
        <span>Goals scored</span>
      </div>
      <div class="profile-stat">
        <strong>${number(player.assists)}</strong>
        <span>Assists</span>
      </div>
      <div class="profile-stat">
        <strong>${number(player.green)}</strong>
        <span>Green cards</span>
      </div>
      <div class="profile-stat">
        <strong>${number(player.yellow)}</strong>
        <span>Yellow cards</span>
      </div>
      <div class="profile-stat">
        <strong>R${number(TEAM.fines[player.name])}</strong>
        <span>Recorded fines</span>
      </div>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function setupPlayerCards() {
  const container = $("#playersGrid");
  if (!container) return;

  container.addEventListener("click", (event) => {
    const card = event.target.closest("[data-player]");
    if (card) openPlayerProfile(card.dataset.player);
  });

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-player]");
    if (!card) return;

    event.preventDefault();
    openPlayerProfile(card.dataset.player);
  });

  $("#playerSearch")?.addEventListener("input", (event) => {
    renderPlayers(event.target.value);
  });

  $("#closeDialog")?.addEventListener("click", () => {
    const dialog = $("#playerDialog");

    if (dialog?.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog?.removeAttribute("open");
    }
  });

  $("#playerDialog")?.addEventListener("click", (event) => {
    const dialog = $("#playerDialog");
    if (event.target === dialog && typeof dialog.close === "function") {
      dialog.close();
    }
  });
}


/* =========================================
   LEADERBOARDS
   ========================================= */

function renderLeaderboard(containerSelector, property, label) {
  const container = $(containerSelector);
  if (!container) return;

  const ranked = [...TEAM.players].sort((a, b) =>
    number(b[property]) - number(a[property]) ||
    a.name.localeCompare(b.name)
  );

  container.innerHTML = `
    <div class="leaderboard-list">
      ${ranked.map((player, index) => `
        <div class="leaderboard-row">
          <span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span>
          <div class="leaderboard-player">
            <strong>${escapeHTML(player.name)}</strong>
            <small>${escapeHTML(label)}</small>
          </div>
          <span class="leaderboard-value">${number(player[property])}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderLeaderboards() {
  renderLeaderboard("#goalsLeaderboard", "goals", "Goals scored");
  renderLeaderboard("#assistsLeaderboard", "assists", "Assists made");
}


/* =========================================
   FULL STATISTICS TABLE
   ========================================= */

function renderStatistics() {
  const container = $("#statsTable");
  if (!container) return;

  const search = ($("#statsSearch")?.value || "").trim().toLowerCase();
  const sortBy = $("#statsSort")?.value || "goals";

  const filtered = TEAM.players.filter((player) =>
    player.name.toLowerCase().includes(search)
  );

  filtered.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    return number(b[sortBy]) - number(a[sortBy]) ||
      a.name.localeCompare(b.name);
  });

  if (!filtered.length) {
    container.innerHTML = `
      <tr><td colspan="6">No players match your search.</td></tr>
    `;
    return;
  }

  container.innerHTML = filtered.map((player) => `
    <tr>
      <td class="table-player-name">${escapeHTML(player.name)}</td>
      <td><span class="stats-number">${number(player.appearances)}</span></td>
      <td><span class="stats-number orange">${number(player.goals)}</span></td>
      <td><span class="stats-number">${number(player.assists)}</span></td>
      <td><span class="stats-number card-green">${number(player.green)}</span></td>
      <td><span class="stats-number card-yellow">${number(player.yellow)}</span></td>
    </tr>
  `).join("");
}

function setupStatisticsControls() {
  $("#statsSearch")?.addEventListener("input", renderStatistics);
  $("#statsSort")?.addEventListener("change", renderStatistics);
}


/* =========================================
   CLUB RECORDS
   ========================================= */

function renderRecords() {
  const greenCards = sum(TEAM.players, "green");
  const yellowCards = sum(TEAM.players, "yellow");
  const injuryCount = TEAM.injuries.length;

  // Current rule: one shot per green card and yellow card.
  // Other rule-related shots are not counted without actual records.
  const totalShots = greenCards + yellowCards;

  setText("#greenCards", greenCards);
  setText("#yellowCards", yellowCards);
  setText("#injuryCount", injuryCount);
  setText("#totalShots", totalShots);
  setText("#teamOfWeekPlayer", TEAM.teamOfTheWeek.player);

  const injuriesContainer = $("#injuriesList");

  if (injuriesContainer) {
    if (!TEAM.injuries.length) {
      injuriesContainer.innerHTML = `
        <p class="no-records">No injuries currently recorded.</p>
      `;
    } else {
      injuriesContainer.innerHTML = `
        <div class="injury-list">
          ${TEAM.injuries.map((injury) => `
            <div class="injury-item">
              <div class="injury-person">
                <strong>${escapeHTML(injury.name)}</strong>
                <small>${escapeHTML(injury.injury)}</small>
              </div>
              <span class="injury-status">${escapeHTML(injury.status)}</span>
            </div>
          `).join("")}
        </div>
      `;
    }
  }

  const finesContainer = $("#finesTable");

  if (finesContainer) {
    finesContainer.innerHTML = TEAM.players.map((player) => `
      <tr>
        <td class="table-player-name">${escapeHTML(player.name)}</td>
        <td>R${number(TEAM.fines[player.name])}</td>
      </tr>
    `).join("");
  }

  const rulesContainer = $("#rulesList");

  if (rulesContainer) {
    rulesContainer.innerHTML = TEAM.rules.map((rule, index) => `
      <li>
        <span class="rule-index">${String(index + 1).padStart(2, "0")}</span>
        <span>${escapeHTML(rule)}</span>
      </li>
    `).join("");
  }
}


/* =========================================
   NAVIGATION & INITIALISATION
   ========================================= */

function setupNavigation() {
  const menuToggle = $("#menuToggle");
  const nav = $("#mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;

        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.15, 0.35]
    });

    sections.forEach((section) => observer.observe(section));
  }
}

function initialiseWebsite() {
  setText("#currentYear", new Date().getFullYear());

  renderSeasonStats();
  renderMatches();
  renderPlayers();
  renderLeaderboards();
  renderStatistics();
  renderRecords();

  setupPlayerCards();
  setupStatisticsControls();
  setupNavigation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseWebsite);
} else {
  initialiseWebsite();
}

